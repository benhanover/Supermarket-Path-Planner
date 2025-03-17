import { signOut } from "aws-amplify/auth"; 
import { useAppContext } from "../context/AppContext";
import Dashboard from "../components/Dashboard/Dashboard";
import InitializeLayout from "../components/InitializeLayout";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { loading, supermarket } = useAppContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="cart" className="text-2xl">
              🛒
            </span>
            <h1 className="text-xl font-bold text-green-700">
              {"Supermarket Planner"}
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 mt-8">
        {supermarket ? <Dashboard /> : <InitializeLayout />}
      </main>

      {/* ✅ הוספת הכפתורים כאן */}
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

    </div>
  );
};

export default Home;
