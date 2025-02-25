import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import SupermarketSetupForm from "../components/SupermarketSetupForm";
import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

const Home: React.FC = () => {
  const { user } = useAppContext();
  const [hasSupermarket, setHasSupermarket] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This function will be passed to the SupermarketSetupForm
  const onSupermarketCreated = () => {
    setHasSupermarket(true);
  };

  useEffect(() => {
    const checkSupermarket = async () => {
      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if the user already has a supermarket
        const { data: supermarkets } = await client.models.Supermarket.list({
          filter: { owner: { eq: user.sub } },
        });

        setHasSupermarket(supermarkets.length > 0);
      } catch (error) {
        console.error("Error checking for supermarket:", error);
        setHasSupermarket(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupermarket();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-10 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-gray-100">
          {hasSupermarket ? user?.supermarketName : "Supermarket Planner"}
        </h1>
        <button
          onClick={async () => {
            try {
              await signOut();
              console.log("User logged out successfully");
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8">
        {hasSupermarket === false ? (
          <SupermarketSetupForm onComplete={onSupermarketCreated} />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
};

export default Home;
