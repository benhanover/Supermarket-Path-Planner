import { useDashboard } from "./DashboardContext";

const DisplaySquare = () => {
  const { selectedSquare, setSelectedSquare } = useDashboard();

  if (!selectedSquare) return null; // Don't render if no square is selected

  return (
    <div className="w-full bg-white p-4 border rounded shadow-lg">
      {/* Close Button */}
      <button
        onClick={() => setSelectedSquare(null)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 hover:bg-red-600"
      >
        X
      </button>

      {/* Display Square Information */}
      <h2 className="text-lg font-bold mb-2">Square Details</h2>
      <p className="text-gray-700">
        📍 Row: {selectedSquare.row}, Col: {selectedSquare.col}
      </p>

      {/* Display Products in a Carousel */}
      <h3 className="text-md font-semibold mt-2">Products:</h3>
      {selectedSquare.products.length > 0 ? (
        <div className="overflow-x-auto w-full mt-2">
          <div className="flex space-x-4">
            {selectedSquare.products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-48 p-2 bg-gray-100 border rounded-md shadow-md"
              >
                <h4 className="font-bold">{product.name}</h4>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No products in this square.</p>
      )}
    </div>
  );
};

export default DisplaySquare;
