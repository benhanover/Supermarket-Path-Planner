import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useAppContext } from "../context/AppContext";
import { SquareType, Square } from "./Dashboard/types";

const client = generateClient<Schema>();

const InitializeLayout: React.FC = () => {
  const { setSupermarket, user } = useAppContext();
  const [formData, setFormData] = useState({
    supermarketName: "",
    address: "",
    layoutRows: 20,
    layoutCols: 30,
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
      // Create initial layout - empty grid
      const initialLayout: Square[][] = Array.from(
        { length: formData.layoutRows },
        (_, row) =>
          Array.from({ length: formData.layoutCols }, (_, col) => ({
            type: "empty" as SquareType,
            productIds: [],
            row,
            col,
          }))
      );

      if (!user?.userId) {
        throw new Error("User not found");
      }

      // Create empty path data structure with metadata
      const emptyPathData = {
        dist: [], // Empty distance matrix
        next: [], // Empty next matrix
        metadata: {
          timestamp: new Date().toISOString(),
          rowCount: formData.layoutRows,
          colCount: formData.layoutCols,
          computed: false // Indicate that this is an empty placeholder
        }
      };

      // Create Supermarket in DataStore with both layout and pathData
      const response = await client.models.Supermarket.create({
        owner: user?.userId,
        name: formData.supermarketName,
        address: formData.address,
        layout: JSON.stringify(initialLayout),
        pathData: JSON.stringify(emptyPathData) // Add empty pathData
      });

      const newSupermarket = response.data;
      if (!newSupermarket) {
        throw new Error("Failed to create supermarket");
      }

      setSupermarket({
        id: newSupermarket.id,
        owner: user.userId,
        name: formData.supermarketName,
        layout: initialLayout,
        products: [],
        pathData: emptyPathData // Include pathData in local state
      });

      console.log("Supermarket created successfully:", newSupermarket.id);
      console.log("Empty pathData initialized for future path computation");
    } catch (error) {
      console.error("Failed to initialize supermarket:", error);
      setError("Failed to initialize supermarket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg my-4 h-full">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">
        Initialize Your Supermarket
      </h1>

      {error && (
        <div className="mb-4 p-2 md:p-3 bg-red-100 text-red-700 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div>
          <label
            htmlFor="supermarketName"
            className="block text-xs md:text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-xs md:text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div>
            <label
              htmlFor="layoutRows"
              className="block text-xs md:text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="layoutCols"
              className="block text-xs md:text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            />
          </div>
        </div>

        <div className="pt-2 md:pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {isSubmitting ? "Initializing..." : "Initialize Supermarket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InitializeLayout;