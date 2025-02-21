import { useState } from "react";
import Products from "./Products";
import { useDashboard } from "./DashboardContext";
import { Product } from "./types/product";

const ProductsEditor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedSquare, setSelectedSquare, layout, setLayout } =
    useDashboard();

  // Function to toggle product selection
  const toggleProductSelection = (product: Product) => {
    if (!selectedSquare) return;

    // Check if the product is already selected
    const isSelected = selectedSquare.products.some((p) => p.id === product.id);

    // Update selected square's products
    const updatedProducts = isSelected
      ? selectedSquare.products.filter((p) => p.id !== product.id) // Remove product
      : [...selectedSquare.products, product]; // Add product

    // Update the square inside the grid layout
    const updatedGrid = layout.grid.map((row) =>
      row.map((square) =>
        square.row === selectedSquare.row && square.col === selectedSquare.col
          ? { ...square, products: updatedProducts }
          : square
      )
    );

    // Update state
    setLayout({ ...layout, grid: updatedGrid });
    setSelectedSquare({ ...selectedSquare, products: updatedProducts });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Products List */}
      <Products
        searchTerm={searchTerm}
        renderProduct={(product) => {
          const isSelected = selectedSquare?.products.some(
            (p) => p.id === product.id
          );

          return (
            <div
              key={product.id}
              className={`p-2 border rounded-lg cursor-pointer transition relative ${
                isSelected
                  ? "bg-yellow-200 border-yellow-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleProductSelection(product)} // Toggle selection on click
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-16 w-16 object-cover rounded mb-2"
              />
              <p className="text-sm font-semibold">{product.title}</p>
              <p className="text-gray-600 font-medium">
                ${product.price.toFixed(2)}
              </p>

              {/* Selection Indicator */}
              {isSelected && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Selected
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default ProductsEditor;
