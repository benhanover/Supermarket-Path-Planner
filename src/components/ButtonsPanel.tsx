import { Link } from "react-router-dom";

const ButtonsPanel: React.FC = () => {
  return (
    <div className="flex justify-center space-x-4 mt-8">
      <Link to="/about" className="flex flex-col items-center space-y-2">
        <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
          <img src="/assets/shopping-cart.png" alt="Info" className="w-16 h-16" />
        </button>
        <span className="text-xs font-bold text-gray-700">General Info</span>
      </Link>

      <Link to="/goal" className="flex flex-col items-center space-y-2">
        <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
          <img src="/assets/directional-sign.png" alt="Goal" className="w-16 h-16" />
        </button>
        <span className="text-xs font-bold text-gray-700">Our Goal</span>
      </Link>

      <Link to="/docs" className="flex flex-col items-center space-y-2">
        <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
          <img src="/assets/store-map.png" alt="Map" className="w-16 h-16" />
        </button>
        <span className="text-xs font-bold text-gray-700">Store Map</span>
      </Link>
    </div>
  );
};

export default ButtonsPanel;
