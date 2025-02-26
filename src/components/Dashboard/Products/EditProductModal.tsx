// import { useState } from "react";
// import { Product } from "../types";

// interface EditProductModalProps {
//   product: Product;
//   onClose: () => void;
//   onSave: (updatedProduct: Product) => void;
// }

// const EditProductModal = ({
//   product,
//   onClose,
//   onSave,
// }: EditProductModalProps) => {
//   const [title, setTitle] = useState(product.title);
//   const [price, setPrice] = useState(product.price);
//   const [image, setImage] = useState(product.image);

//   const handleSave = () => {
//     onSave({ ...product, title, price, image }); // ✅ Sends updated product back to `ProductsEditor.tsx`
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
//         <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

//         {/* Title Input */}
//         <label className="block mb-2">
//           <span className="text-gray-700">Product Title</span>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </label>

//         {/* Price Input */}
//         <label className="block mb-2">
//           <span className="text-gray-700">Price</span>
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             value={price}
//             onChange={(e) => setPrice(parseFloat(e.target.value))}
//           />
//         </label>

//         {/* Image URL Input */}
//         <label className="block mb-2">
//           <span className="text-gray-700">Image URL</span>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//           />
//         </label>

//         {/* Buttons */}
//         <div className="flex justify-end mt-4">
//           <button
//             className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={handleSave}
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProductModal;
import { useState } from "react";
import { Product } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave?: (updatedProduct: Product) => void;
}

const EditProductModal = ({
  product,
  onClose,
  onSave,
}: EditProductModalProps) => {
  const { updateProductData, isSaving } = useDashboard();
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category || "");
  const [description, setDescription] = useState(product.description || "");
  const [image, setImage] = useState(product.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title || price <= 0) {
      setError("Title and price are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const updatedProduct: Product = {
        ...product,
        title,
        price,
        category,
        description,
        image,
      };

      // Update product in database via context
      await updateProductData(updatedProduct);

      // Call the onSave callback if provided
      if (onSave) {
        onSave(updatedProduct);
      }

      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      setError(typeof error === "string" ? error : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

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
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            step="0.01"
            min="0"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Category</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            {isSubmitting || isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
