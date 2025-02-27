import { useState } from "react";
import { updateUserAttributes } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
import { User } from "../types";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

const InitializeLayout: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [formData, setFormData] = useState({
    supermarketName: user?.supermarketName || "",
    address: user?.address || "",
    layoutRows: user?.layoutRows || 20,
    layoutCols: user?.layoutCols || 30,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "layoutRows" || name === "layoutCols" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Update user attributes in Cognito
      await updateUserAttributes({
        userAttributes: {
          "custom:supermarket_name": formData.supermarketName,
          address: formData.address,
          "custom:layout_rows": formData.layoutRows.toString(),
          "custom:layout_cols": formData.layoutCols.toString(),
        },
      });

      // Create initial layout - empty grid
      const initialLayout = Array.from(
        { length: formData.layoutRows },
        (_, row) =>
          Array.from({ length: formData.layoutCols }, (_, col) => ({
            type: "empty",
            productIds: [],
            row,
            col,
          }))
      );

      // Create Supermarket in DataStore
      await client.models.Supermarket.create({
        name: formData.supermarketName,
        address: formData.address,
        layout: JSON.stringify(initialLayout),
      });

      // Update local user state
      setUser((prevUser) => {
        if (!prevUser) return null;

        return {
          ...prevUser,
          supermarketName: formData.supermarketName,
          address: formData.address,
          layoutRows: formData.layoutRows,
          layoutCols: formData.layoutCols,
        } satisfies User;
      });
    } catch (error) {
      console.error("Failed to initialize supermarket:", error);
      setError("Failed to initialize supermarket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Initialize Your Supermarket
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="supermarketName"
            className="block text-sm font-medium text-gray-700"
          >
            Supermarket Name
          </label>
          <input
            type="text"
            id="supermarketName"
            name="supermarketName"
            value={formData.supermarketName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Supermarket Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="layoutRows"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Rows
            </label>
            <input
              type="number"
              id="layoutRows"
              name="layoutRows"
              min="5"
              max="100"
              value={formData.layoutRows}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="layoutCols"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Columns
            </label>
            <input
              type="number"
              id="layoutCols"
              name="layoutCols"
              min="5"
              max="100"
              value={formData.layoutCols}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {isSubmitting ? "Initializing..." : "Initialize Supermarket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InitializeLayout;
