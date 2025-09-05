import { useAppContext } from "../../../context/AppContext";
import { Square } from "../types";
import { StorageImage } from '@aws-amplify/ui-react-storage';

interface ProductHoverCardProps {
  square: Square;
  position: { x: number, y: number };
  onClose: () => void;
}

const ProductHoverCard = ({ square, position, onClose }: ProductHoverCardProps) => {
  const { supermarket } = useAppContext();

  if (!supermarket || square.type !== "products" || square.productIds.length === 0) {
    return null;
  }

  // Get the actual products from the IDs
  const productList = square.productIds
    .map((id) => supermarket.products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  if (productList.length === 0) {
    return null;
  }

  // Calculate position with boundaries to avoid edges
  const cardStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    zIndex: 50,
    transform: 'translate(10px, 10px)', // Offset from cursor
    width: '220px',
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 product-hover-card"
      style={cardStyle}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-700">Products in this square:</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {productList.map((product) => (
          product && (
            <div key={product.id} className="p-2 bg-gray-50 rounded flex items-center gap-2 border border-gray-100">
              <div className="w-10 h-10 flex-shrink-0">
                <StorageImage
                  alt={product.title}
                  path={product.image}
                  className="w-full h-full object-cover rounded"
                  fallbackSrc="/assets/product-placeholder.png"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-800 truncate" title={product.title}>
                  {product.title}
                </h4>
                <p className="text-xs text-gray-600">${product.price.toFixed(2)}</p>
                {product.category && (
                  <span className="inline-block text-xs bg-gray-200 rounded-full px-1 py-0.5 truncate max-w-full">
                    {product.category}
                  </span>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ProductHoverCard;