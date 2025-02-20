import { useState, useEffect } from "react";
import Products from "./Products";

const ProductsEditor = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch products from a free supermarket API
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="p-2 border rounded w-full mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Products Component */}
      <Products products={filteredProducts} />
    </div>
  );
};

export default ProductsEditor;
