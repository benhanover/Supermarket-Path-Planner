import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
import Dashboard from "../components/Dashboard/Dashboard";
import InitializeLayout from "../components/InitializeLayout";
const Home: React.FC = () => {
  const { loading, supermarket } = useAppContext();

  const resetSupermarket = async () => {
    try {
      console.log("needs implementation");
    } catch (error) {
      console.error("Failed to reset supermarket:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading state while fetching user data
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

          {process.env.NODE_ENV === "development" && (
            <button
              onClick={resetSupermarket}
              className="px-4 py-2 mr-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Reset Store
            </button>
          )}
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
    </div>
  );
};

export default Home;
