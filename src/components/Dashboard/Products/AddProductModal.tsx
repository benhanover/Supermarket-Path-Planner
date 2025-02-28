import { useState } from "react";
import { Product } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";

interface AddProductModalProps {
  onClose: () => void;
  onSave?: (newProduct: Product) => void;
}

const AddProductModal = ({ onClose, onSave }: AddProductModalProps) => {
  const { addProduct, isSaving } = useDashboard();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSave = async () => {
    if (!title || price === "" || !category) {
      setError("Title, price, and category are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const newProductData = {
        title,
        price: Number(price),
        category,
        description,
        image,
        rating: { rate: 0, count: 0 },
      };

      // Add product to database via context
      const productId = await addProduct(newProductData);
      console.log("product id", productId);

      // Create full product object with the returned ID
      const newProduct: Product = {
        id: productId,
        ...newProductData,
      };

      // Call the onSave callback if provided
      if (onSave) {
        onSave(newProduct);
      }

      onClose(); // Close modal
    } catch (error) {
      console.error("Error saving product:", error);
      setError(typeof error === "string" ? error : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Product Title *</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Price *</span>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            step="0.01"
            min="0"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Category *</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Description</span>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Image URL</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2 hover:bg-gray-500"
            onClick={onClose}
            disabled={isSubmitting || isSaving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            onClick={handleSave}
            disabled={isSubmitting || isSaving}
          >
            {(isSubmitting || isSaving) && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            )}
            {isSubmitting || isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
