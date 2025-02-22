// import { useState } from "react";
// import Products from "./Products";
// import { useDashboard } from "../DashboardContext";
// import { Product } from "../types/product";
// import EditProductModal from "./EditProductModal";

// interface ProductsEditorProps {
//   mode: "square" | "global";
// }

// const ProductsEditor = ({ mode }: ProductsEditorProps) => {
//   const {
//     selectedSquare,
//     setSelectedSquare,
//     setLayout,
//     products,
//     setProducts,
//   } = useDashboard();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editProduct, setEditProduct] = useState<Product | null>(null);

//   mode === "square" ? selectedSquare?.products || [] : products;

//   // ✅ Function to update a product globally AND inside all squares
//   const updateProduct = (updatedProduct: Product) => {
//     // Update the global product list
//     setProducts((prevProducts) =>
//       prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
//     );

//     // ✅ Update all squares that contain the edited product
//     setLayout((prevLayout) => {
//       const updatedGrid = prevLayout.grid.map((row) =>
//         row.map((square) => ({
//           ...square,
//           products: square.products.map((p) =>
//             p.id === updatedProduct.id ? updatedProduct : p
//           ),
//         }))
//       );
//       return { ...prevLayout, grid: updatedGrid };
//     });

//     // ✅ If in "square" mode, update selected square's products immediately
//     if (mode === "square" && selectedSquare) {
//       const updatedProducts = selectedSquare.products.map((p) =>
//         p.id === updatedProduct.id ? updatedProduct : p
//       );

//       setSelectedSquare({ ...selectedSquare, products: updatedProducts });
//     }
//   };

//   // ✅ Function to toggle product selection inside a square
//   const toggleProductSelection = (product: Product) => {
//     if (mode !== "square" || !selectedSquare) return;

//     const isSelected = selectedSquare.products.some((p) => p.id === product.id);
//     const updatedProducts = isSelected
//       ? selectedSquare.products.filter((p) => p.id !== product.id) // Remove product
//       : [...selectedSquare.products, product]; // Add product

//     // Update the selected square
//     setSelectedSquare({ ...selectedSquare, products: updatedProducts });

//     // Update the layout grid
//     setLayout((prevLayout) => {
//       const updatedGrid = prevLayout.grid.map((row) =>
//         row.map((square) =>
//           square.row === selectedSquare.row && square.col === selectedSquare.col
//             ? { ...square, products: updatedProducts }
//             : square
//         )
//       );
//       return { ...prevLayout, grid: updatedGrid };
//     });
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg font-bold">
//         {mode === "square" ? "Edit Square Products" : "Manage All Products"}
//       </h2>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search products..."
//         className="w-full p-2 mb-4 border rounded"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {/* Products List */}
//       <Products
//         searchTerm={searchTerm}
//         renderProduct={(product) => {
//           const isSelected =
//             mode === "square" &&
//             selectedSquare?.products.some((p) => p.id === product.id);

//           return (
//             <div
//               key={product.id}
//               className={`p-2 border rounded-lg cursor-pointer transition relative ${
//                 isSelected
//                   ? "bg-yellow-200 border-yellow-400"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={
//                 mode === "square"
//                   ? () => toggleProductSelection(product)
//                   : undefined
//               }
//             >
//               <img
//                 src={product.image}
//                 alt={product.title}
//                 className="h-16 w-16 object-cover rounded mb-2"
//               />
//               <p className="text-sm font-semibold">{product.title}</p>
//               <p className="text-gray-600 font-medium">
//                 ${product.price.toFixed(2)}
//               </p>

//               {/* Buttons based on mode */}
//               {mode === "square" && isSelected && (
//                 <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//                   Selected
//                 </span>
//               )}
//               {mode === "global" && (
//                 <button
//                   onClick={() => setEditProduct(product)} // Open edit modal
//                   className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
//                 >
//                   Edit Product
//                 </button>
//               )}
//             </div>
//           );
//         }}
//       />

//       {/* Edit Product Modal */}
//       {editProduct && (
//         <EditProductModal
//           product={editProduct}
//           onClose={() => setEditProduct(null)}
//           onSave={updateProduct}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductsEditor;

import { useState } from "react";
import Products from "./Products";
import { useDashboard } from "../DashboardContext";
import { Product } from "../types/product";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal"; // ✅ Import new modal

interface ProductsEditorProps {
  mode: "square" | "global";
}

const ProductsEditor = ({ mode }: ProductsEditorProps) => {
  const {
    selectedSquare,
    setSelectedSquare,
    layout,
    setLayout,
    products,
    setProducts,
  } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false); // ✅ Track modal visibility

  // ✅ Function to add a new product (only in global mode)
  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const removeProduct = (productId: number) => {
    // ✅ Remove from global products list
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );

    // ✅ Remove from all squares in the layout
    setLayout((prevLayout) => {
      const updatedGrid = prevLayout.grid.map((row) =>
        row.map((square) => ({
          ...square,
          products: square.products.filter((p) => p.id !== productId), // Remove deleted product
        }))
      );
      return { ...prevLayout, grid: updatedGrid };
    });

    // ✅ If selectedSquare contains the deleted product, update it
    if (selectedSquare) {
      const updatedProducts = selectedSquare.products.filter(
        (p) => p.id !== productId
      );
      setSelectedSquare({ ...selectedSquare, products: updatedProducts });
    }
  };

  // ✅ Function to update a product globally AND inside all squares
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    setLayout((prevLayout) => {
      const updatedGrid = prevLayout.grid.map((row) =>
        row.map((square) => ({
          ...square,
          products: square.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        }))
      );
      return { ...prevLayout, grid: updatedGrid };
    });

    if (mode === "square" && selectedSquare) {
      const updatedProducts = selectedSquare.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );

      setSelectedSquare({ ...selectedSquare, products: updatedProducts });
    }
  };

  // ✅ Function to toggle product selection inside a square
  const toggleProductSelection = (product: Product) => {
    if (mode !== "square" || !selectedSquare) return;

    const isSelected = selectedSquare.products.some((p) => p.id === product.id);
    const updatedProducts = isSelected
      ? selectedSquare.products.filter((p) => p.id !== product.id) // Remove product
      : [...selectedSquare.products, product]; // Add product

    // Update the selected square
    setSelectedSquare({ ...selectedSquare, products: updatedProducts });

    // Update the layout grid
    setLayout((prevLayout) => {
      const updatedGrid = prevLayout.grid.map((row) =>
        row.map((square) =>
          square.row === selectedSquare.row && square.col === selectedSquare.col
            ? { ...square, products: updatedProducts }
            : square
        )
      );
      return { ...prevLayout, grid: updatedGrid };
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">
        {mode === "square" ? "Edit Square Products" : "Manage All Products"}
      </h2>

      {/* ✅ Show "Add Product" button in global mode */}
      {mode === "global" && (
        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded mb-4 hover:bg-green-600"
        >
          + Add Product
        </button>
      )}

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

              {/* Buttons based on mode */}
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

      {/* ✅ Add Product Modal (Only in Global Mode) */}
      {showAddProductModal && mode === "global" && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={addProduct}
        />
      )}

      {/* Edit Product Modal */}
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
