// import { useState } from "react";
// import Products from "./Products";
// import { useDashboard } from "../DashboardContext/useDashboard";
// import { Product } from "../types";
// import EditProductModal from "./EditProductModal";
// import AddProductModal from "./AddProductModal";

// interface ProductsEditorProps {
//   mode: "square" | "global";
// }

// const ProductsEditor = ({ mode }: ProductsEditorProps) => {
//   const { selectedSquare, setSelectedSquare, supermarket, setSupermarket } =
//     useDashboard();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editProduct, setEditProduct] = useState<Product | null>(null);
//   const [showAddProductModal, setShowAddProductModal] = useState(false);

//   const addProduct = (newProduct: Product) => {
//     setSupermarket((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         products: [...prev.products, newProduct],
//       };
//     });
//   };

//   const removeProduct = (productId: number) => {
//     // Remove from global products list
//     setSupermarket((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         products: prev.products.filter((p) => p.id !== productId),
//         // Also remove from any square that might have this product
//         layout: prev.layout.map((row) =>
//           row.map((square) => ({
//             ...square,
//             products: square.products.filter((p) => p.id !== productId),
//           }))
//         ),
//       };
//     });

//     if (selectedSquare) {
//       const updatedProducts = selectedSquare.products.filter(
//         (p) => p.id !== productId
//       );
//       setSelectedSquare({ ...selectedSquare, products: updatedProducts });
//     }
//   };

//   const updateProduct = (updatedProduct: Product) => {
//     // Update in global products list
//     setSupermarket((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         products: prev.products.map((p) =>
//           p.id === updatedProduct.id ? updatedProduct : p
//         ),
//         // Also update in any square that might have this product
//         layout: prev.layout.map((row) =>
//           row.map((square) => ({
//             ...square,
//             products: square.products.map((p) =>
//               p.id === updatedProduct.id ? updatedProduct : p
//             ),
//           }))
//         ),
//       };
//     });

//     if (mode === "square" && selectedSquare) {
//       const updatedProducts = selectedSquare.products.map((p) =>
//         p.id === updatedProduct.id ? updatedProduct : p
//       );
//       setSelectedSquare({ ...selectedSquare, products: updatedProducts });
//     }
//   };

//   const toggleProductSelection = (product: Product) => {
//     if (mode !== "square" || !selectedSquare) return;

//     const isSelected = selectedSquare.products.some((p) => p.id === product.id);
//     const updatedProducts = isSelected
//       ? selectedSquare.products.filter((p) => p.id !== product.id)
//       : [...selectedSquare.products, product];

//     // Update selected square
//     setSelectedSquare({ ...selectedSquare, products: updatedProducts });

//     // Update supermarket layout
//     setSupermarket((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         layout: prev.layout.map((row) =>
//           row.map((square) =>
//             square.row === selectedSquare.row &&
//             square.col === selectedSquare.col
//               ? { ...square, products: updatedProducts }
//               : square
//           )
//         ),
//       };
//     });
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg font-bold">
//         {mode === "square" ? "Edit Square Products" : "Manage All Products"}
//       </h2>

//       {mode === "global" && (
//         <button
//           onClick={() => setShowAddProductModal(true)}
//           className="px-4 py-2 bg-green-500 text-white rounded mb-4 hover:bg-green-600"
//         >
//           + Add Product
//         </button>
//       )}

//       <input
//         type="text"
//         placeholder="Search products..."
//         className="w-full p-2 mb-4 border rounded"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

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

//               {mode === "square" && isSelected && (
//                 <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//                   Selected
//                 </span>
//               )}
//               {mode === "global" && (
//                 <div className="flex justify-between mt-2">
//                   <button
//                     onClick={() => setEditProduct(product)}
//                     className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => removeProduct(product.id)}
//                     className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         }}
//       />

//       {showAddProductModal && mode === "global" && (
//         <AddProductModal
//           onClose={() => setShowAddProductModal(false)}
//           onSave={addProduct}
//         />
//       )}

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
import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";

interface ProductsEditorProps {
  mode: "square" | "global";
}

const ProductsEditor = ({ mode }: ProductsEditorProps) => {
  const {
    selectedSquare,
    setSelectedSquare,
    setSupermarket,
    removeProduct,
    supermarket,
    isSaving,
    saveLayout,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleDeleteProduct = async (productId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    ) {
      try {
        await removeProduct(productId);
        // The state updates are handled within the removeProduct function
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const toggleProductSelection = async (product: Product) => {
    if (mode !== "square" || !selectedSquare) return;

    // Check if product is already in the square
    const isSelected = selectedSquare.productIds.includes(product.id);
    const updatedProductIds = isSelected
      ? selectedSquare.productIds.filter((id) => id !== product.id)
      : [...selectedSquare.productIds, product.id];

    // Update selected square
    setSelectedSquare({ ...selectedSquare, productIds: updatedProductIds });

    // Create the updated layout directly
    const updatedLayout = supermarket?.layout.map((row) =>
      row.map((square) =>
        square.row === selectedSquare.row && square.col === selectedSquare.col
          ? { ...square, productIds: updatedProductIds }
          : square
      )
    );

    // Update supermarket layout in state
    setSupermarket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        layout: updatedLayout,
      };
    });

    // Save the updated layout directly using the layout we just created
    // This way we don't depend on the updated state being available yet
    if (updatedLayout) {
      try {
        await saveLayout(updatedLayout);
      } catch (error) {
        console.error("Failed to save product selection:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold">
        {mode === "square" ? "Edit Square Products" : "Manage All Products"}
      </h2>

      {mode === "global" && (
        <button
          onClick={() => setShowAddProductModal(true)}
          className={`px-4 py-2 bg-green-500 text-white rounded mb-4 hover:bg-green-600 flex items-center ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
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
              Processing...
            </>
          ) : (
            "+ Add Product"
          )}
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
            selectedSquare?.productIds.includes(product.id);

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
                className="h-16 w-16 object-cover rounded mb-2 mx-auto"
              />
              <p className="text-sm font-semibold">{product.title}</p>
              <p className="text-gray-600 font-medium">
                ${product.price.toFixed(2)}
              </p>
              {product.category && (
                <span className="text-xs bg-gray-200 rounded-full px-2 py-1 mt-1 inline-block">
                  {product.category}
                </span>
              )}

              {mode === "square" && isSelected && (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Selected
                </span>
              )}
              {mode === "global" && (
                <div className="flex justify-between mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditProduct(product);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                    disabled={isSaving}
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
        <AddProductModal onClose={() => setShowAddProductModal(false)} />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsEditor;
