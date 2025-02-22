import { useDashboard } from "../DashboardContext";

const DisplaySquare = () => {
  const { selectedSquare, setSelectedSquare } = useDashboard();
  if (!selectedSquare) return null;

  return (
    <div className="w-full max-w-md bg-white p-6 border rounded-lg shadow-lg relative">
      {/* Close Button */}
      <button
        onClick={() => setSelectedSquare(null)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 hover:bg-red-600 transition"
      >
        ✕
      </button>

      {/* Square Details */}
      <h2 className="text-xl font-bold mb-2 text-gray-900">Square Details</h2>
      <p className="text-gray-700">
        📍 <span className="font-medium">Row:</span> {selectedSquare.row},
        <span className="font-medium"> Col:</span> {selectedSquare.col}
      </p>

      {/* Product List */}
      <h3 className="text-lg font-semibold mt-4">Products:</h3>
      {selectedSquare.products.length > 0 ? (
        <div className="overflow-x-auto w-full mt-2">
          <div className="flex space-x-4 p-2 bg-gray-50 rounded-md">
            {selectedSquare.products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-none w-40 p-3 bg-white border rounded-lg shadow-md text-center"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <h4 className="text-sm font-semibold text-gray-900">
                  {product.title}
                </h4>
                <p className="text-gray-600 font-medium">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No products in this square.</p>
      )}
    </div>
  );
};

export default DisplaySquare;
