import { useAppContext } from "../../../context/AppContext";
import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";
import { useState } from "react";

const DisplaySquare = () => {
  const { selectedSquare, setSelectedSquare } = useDashboard();
  const { supermarket } = useAppContext();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  if (!selectedSquare || !supermarket) return null;

  // Get the actual products from the IDs
  const productList = selectedSquare.productIds
    .map((id) => supermarket.products.find((p) => p.id === id))
    .filter((p) => p !== undefined) as Product[];

  const handleImageError = (productId: string) => {
    setImgErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <div className="w-full max-w-md bg-white p-3 md:p-6 border rounded-lg shadow-lg relative">
      {/* Close Button */}
      <button
        onClick={() => setSelectedSquare(null)}
        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-red-600 transition text-xs md:text-sm"
      >
        ✕
      </button>

      {/* Square Details */}
      <h2 className="text-base md:text-xl font-bold mb-1 md:mb-2 text-gray-900 pr-6">Square Details</h2>
      <p className="text-xs md:text-sm text-gray-700">
        📍 <span className="font-medium">Row:</span> {selectedSquare.row},
        <span className="font-medium"> Col:</span> {selectedSquare.col}
      </p>

      {/* Product List */}
      <h3 className="text-sm md:text-lg font-semibold mt-2 md:mt-4">Products:</h3>
      {productList.length > 0 ? (
        <div className="overflow-x-auto w-full mt-1 md:mt-2">
          <div className="flex space-x-2 md:space-x-4 p-2 bg-gray-50 rounded-md">
            {productList.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-none w-24 md:w-40 p-2 md:p-3 bg-white border rounded-lg shadow-md text-center"
              >
                <img
                  src={imgErrors[product.id] ? "/assets/product-placeholder.png" : (product.image || "/assets/product-placeholder.png")}
                  alt={product.title}
                  className="w-full h-12 md:h-24 object-cover rounded-md mb-1 md:mb-2"
                  onError={() => handleImageError(product.id)}
                />
                <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate" title={product.title}>
                  {product.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">No products in this square.</p>
      )}
    </div>
  );
};

export default DisplaySquare;