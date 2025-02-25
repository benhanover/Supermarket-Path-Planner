import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";
import { updateUserAttributes } from "aws-amplify/auth";

const client = generateClient<Schema>();

interface SupermarketSetupFormProps {
  onComplete: () => void;
}

const SupermarketSetupForm: React.FC<SupermarketSetupFormProps> = ({
  onComplete,
}) => {
  const { user, setUser } = useAppContext();

  const [supermarketName, setSupermarketName] = useState("");
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update user attributes in Cognito
      await updateUserAttributes({
        userAttributes: {
          "custom:supermarket_name": supermarketName,
          "custom:layout_rows": rows.toString(),
          "custom:layout_cols": cols.toString(),
        },
      });

      // 2. Create a new supermarket first
      const { data: newSupermarket } = await client.models.Supermarket.create({
        owner: user?.sub || "",
        name: supermarketName,
        address: user?.address || "Default Address",
      });

      if (!newSupermarket) {
        throw new Error("Failed to create supermarket");
      }

      // 3. Create a layout and associate it with the supermarket
      const { data: newLayout } = await client.models.Layout.create({
        rows,
        cols,
        supermarketID: newSupermarket.id, // Link to the supermarket
      });

      if (!newLayout) {
        throw new Error("Failed to create layout");
      }

      if (!newSupermarket) {
        throw new Error("Failed to create supermarket");
      }

      // 4. Create initial squares for the layout
      const squarePromises = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          squarePromises.push(
            client.models.Square.create({
              type: "empty",
              row,
              col,
              layoutID: newLayout.id,
            })
          );
        }
      }

      // Execute square creation in batches to avoid overwhelming the API
      const batchSize = 25;
      for (let i = 0; i < squarePromises.length; i += batchSize) {
        await Promise.all(squarePromises.slice(i, i + batchSize));
      }

      // 5. Update local user state
      if (user) {
        setUser({
          ...user,
          supermarketName,
          layoutRows: rows,
          layoutCols: cols,
        });
      }

      // Success! Call the onComplete callback to update parent component state
      console.log("Supermarket setup complete!");
      onComplete();
    } catch (err) {
      console.error("Error setting up supermarket:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create supermarket"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Set Up Your Supermarket
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="supermarketName"
              className="block text-gray-700 font-medium mb-1"
            >
              Supermarket Name
            </label>
            <input
              id="supermarketName"
              type="text"
              value={supermarketName}
              onChange={(e) => setSupermarketName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Supermarket"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rows"
                className="block text-gray-700 font-medium mb-1"
              >
                Rows
              </label>
              <input
                id="rows"
                type="number"
                min="5"
                max="50"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 20)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="cols"
                className="block text-gray-700 font-medium mb-1"
              >
                Columns
              </label>
              <input
                id="cols"
                type="number"
                min="5"
                max="50"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 30)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your supermarket...
                </div>
              ) : (
                "Create Supermarket"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            This will create your supermarket with an empty layout that you can
            customize later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketSetupForm;
