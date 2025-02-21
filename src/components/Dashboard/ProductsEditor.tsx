import { useState } from "react";
import Products from "./Products";

const ProductsEditor = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Products searchTerm={searchTerm} />
    </div>
  );
};

export default ProductsEditor;
