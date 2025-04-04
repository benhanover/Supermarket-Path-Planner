import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
import Dashboard from "../components/Dashboard/Dashboard";
import InitializeLayout from "../components/InitializeLayout";
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

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-purple-100">
      <header className="bg-purple-950 shadow-md p-4">
        <div className="flex justify-between items-center w-full px-6">
          <div className="flex items-center space-x-2">
            <span
              role="img"
              aria-label="cart"
              className="text-2xl text-gray-200"
            >
              🛒
            </span>
            <h1 className="text-2xl font-smibold text-gray-200">
              {"Supermarket Path Planner"}
            </h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-3xl px-4 py-2 font-bold text-white rounded hover:bg-black transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex min-h-screen">
        {supermarket ? <Dashboard /> : <InitializeLayout />}
      </main>
    </div>
  );
};

export default Home;
