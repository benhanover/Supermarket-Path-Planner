import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
import Dashboard from "../components/Dashboard/Dashboard";
import InitializeLayout from "../components/InitializeLayout";
import { useState } from "react";

const Home: React.FC = () => {
  const { loading, supermarket } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-violet-900 shadow-md p-2 md:p-4">
        <div className="flex justify-between items-center w-full px-2 md:px-6">
          <div className="flex items-center space-x-2">
            <span
              role="img"
              aria-label="cart"
              className="text-xl md:text-2xl text-gray-200"
            >
              🛒
            </span>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-200 truncate">
              Supermarket Path Planner
            </h1>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <button
            onClick={handleSignOut}
            className="hidden md:block text-lg md:text-xl px-3 md:px-4 py-1 md:py-2 font-bold text-white rounded hover:bg-black transition"
          >
            Logout
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-violet-800 mt-2 p-2 rounded-md">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-lg font-bold text-white rounded hover:bg-violet-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="flex min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : supermarket ? (
          <Dashboard />
        ) : (
          <InitializeLayout />
        )}
      </main>
    </div>
  );
};

export default Home;
