import { useState } from "react";
import { Product } from "../types/product";

interface AddProductModalProps {
  onClose: () => void;
  onSave: (newProduct: Product) => void;
}

const AddProductModal = ({ onClose, onSave }: AddProductModalProps) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState({ rate: 0, count: 0 });

  // ✅ Handle form submission
  const handleSave = () => {
    if (!title || price === "" || !category || !description || !image) {
      alert("Please fill out all fields before saving.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(), // Unique ID
      title,
      price: Number(price),
      category,
      description,
      image,
      rating,
    };

    onSave(newProduct); // Pass new product to parent component
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>

        <label className="block mb-2">
          <span className="text-gray-700">Product Title</span>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Price</span>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
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
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
