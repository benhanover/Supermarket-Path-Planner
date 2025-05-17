import Draggable from "react-draggable";
import { useAppContext } from "../../../context/AppContext";
import { useDashboard } from "../DashboardContext/useDashboard";
import { Product } from "../types";
import { StorageImage } from "@aws-amplify/ui-react-storage";

const DisplaySquare = () => {
  const { selectedSquare, setSelectedSquare } = useDashboard();
  const { supermarket } = useAppContext();

  if (!selectedSquare || !supermarket) return null;

  const productList = selectedSquare.productIds
    .map((id) => supermarket.products.find((p) => p.id === id))
    .filter((p) => p !== undefined) as Product[];

  return (
    <Draggable handle=".drag-handle" bounds="parent">
      <div
        className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white p-3 md:p-6 border rounded-lg shadow-lg z-50 w-full max-w-md"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* Drag Handle */}
        <div className="drag-handle cursor-move text-center text-gray-600 text-xs mb-1">
          ⇕ Drag to move
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedSquare(null)}
          className="absolute top-1 right-1 md:top-2 md:right-2 bg-rose-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-rose-700 transition text-xs md:text-sm"
        >
          ✕
        </button>

        <h2 className="text-base md:text-xl font-bold mb-1 md:mb-2 text-gray-900 pr-6">Square Details</h2>
        <p className="text-xs md:text-sm text-gray-700">
          📍 <span className="font-medium">Row:</span> {selectedSquare.row},
          <span className="font-medium"> Col:</span> {selectedSquare.col}
        </p>

        <h3 className="text-sm md:text-lg font-semibold mt-2 md:mt-4">Products:</h3>
        {productList.length > 0 ? (
          <div className="overflow-y-auto max-h-60 mt-1 md:mt-2 pr-2">
            <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-md">
              {productList.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex items-center gap-3 p-2 bg-white border rounded-lg shadow-md"
                >
                  <StorageImage
                    alt="product"
                    path={product.image}
                    className="w-12 h-12 object-contain rounded"
                  />
                  <div className="flex flex-col">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate" title={product.title}>
                      {product.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.category && (
                      <span className="text-[10px] bg-gray-200 rounded-full px-2 py-0.5 mt-1 inline-block truncate max-w-full">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
            No products in this square.
          </p>
        )}
      </div>
    </Draggable>
  );
};

export default DisplaySquare;
