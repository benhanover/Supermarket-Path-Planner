import { useState } from "react";
import { Product } from "./types/product";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal = ({
  product,
  onClose,
  onSave,
}: EditProductModalProps) => {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(product.image);

  const handleSave = () => {
    onSave({ ...product, title, price, image }); // ✅ Sends updated product back to `ProductsEditor.tsx`
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

        {/* Title Input */}
        <label className="block mb-2">
          <span className="text-gray-700">Product Title</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        {/* Price Input */}
        <label className="block mb-2">
          <span className="text-gray-700">Price</span>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>

        {/* Image URL Input */}
        <label className="block mb-2">
          <span className="text-gray-700">Image URL</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
