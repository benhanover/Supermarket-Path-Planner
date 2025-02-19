import { useDashboard } from "./DashboardContext";

const DisplaySquare = () => {
  const { selectedSquare, setSelectedSquare } = useDashboard();

  if (!selectedSquare) return null; // Don't render if no square is selected

  return (
    <div className="fixed top-10 right-10 bg-white p-4 border rounded shadow-lg">
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

      {/* Display Products */}
      <h3 className="text-md font-semibold mt-2">Products:</h3>
      {selectedSquare.products.length > 0 ? (
        <ul className="mt-2">
          {selectedSquare.products.map((product) => (
            <li key={product.id} className="border-b py-1">
              {product.name} - ${product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No products in this square.</p>
      )}
    </div>
  );
};

export default DisplaySquare;
