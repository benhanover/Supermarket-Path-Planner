import { useState } from "react";
import Products from "./Products";
import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";

interface ProductsEditorProps {
  mode: "square" | "global";
}

const ProductsEditor = ({ mode }: ProductsEditorProps) => {
  const { selectedSquare, setSelectedSquare, supermarket, setSupermarket } =
    useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  
  const addProduct = (newProduct: Product) => {
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: [...prev.products, newProduct],
      };
    });
  };

  const removeProduct = (productId: number) => {
    // Remove from global products list
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        // Also remove from any square that might have this product
        layout: prev.layout.map((row) =>
          row.map((square) => ({
            ...square,
            products: square.products.filter((p) => p.id !== productId),
          }))
        ),
      };
    });

    if (selectedSquare) {
      const updatedProducts = selectedSquare.products.filter(
        (p) => p.id !== productId
      );
      setSelectedSquare({ ...selectedSquare, products: updatedProducts });
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    // Update in global products list
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        products: prev.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        // Also update in any square that might have this product
        layout: prev.layout.map((row) =>
          row.map((square) => ({
            ...square,
            products: square.products.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            ),
          }))
        ),
      };
    });

    if (mode === "square" && selectedSquare) {
      const updatedProducts = selectedSquare.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setSelectedSquare({ ...selectedSquare, products: updatedProducts });
    }
  };

  const toggleProductSelection = (product: Product) => {
    if (mode !== "square" || !selectedSquare) return;

    const isSelected = selectedSquare.products.some((p) => p.id === product.id);
    const updatedProducts = isSelected
      ? selectedSquare.products.filter((p) => p.id !== product.id)
      : [...selectedSquare.products, product];

    // Update selected square
    setSelectedSquare({ ...selectedSquare, products: updatedProducts });

    // Update supermarket layout
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        layout: prev.layout.map((row) =>
          row.map((square) =>
            square.row === selectedSquare.row &&
            square.col === selectedSquare.col
              ? { ...square, products: updatedProducts }
              : square
          )
        ),
      };
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">
        {mode === "square" ? "Edit Square Products" : "Manage All Products"}
      </h2>

      {mode === "global" && (
        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded mb-4 hover:bg-green-600"
        >
          + Add Product
        </button>
      )}

      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Products
        searchTerm={searchTerm}
        renderProduct={(product) => {
          const isSelected =
            mode === "square" &&
            selectedSquare?.products.some((p) => p.id === product.id);

          return (
            <div
              key={product.id}
              className={`p-2 border rounded-lg cursor-pointer transition relative ${
                isSelected
                  ? "bg-yellow-200 border-yellow-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={
                mode === "square"
                  ? () => toggleProductSelection(product)
                  : undefined
              }
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

              {mode === "square" && isSelected && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Selected
                </span>
              )}
              {mode === "global" && (
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setEditProduct(product)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />

      {showAddProductModal && mode === "global" && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={addProduct}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={updateProduct}
        />
      )}
    </div>
  );
};

export default ProductsEditor;
