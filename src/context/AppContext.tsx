import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Supermarket } from "../components/Dashboard/types";
import { getCurrentUser, AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";

interface AppContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  supermarket: Supermarket | null;
  setSupermarket: React.Dispatch<React.SetStateAction<Supermarket | null>>;
  supermarketId: string | null;
  setSupermarketId: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  error: { message: string; source: string } | null;
  setError: React.Dispatch<
    React.SetStateAction<{ message: string; source: string } | null>
  >;
  handleError: (error: unknown, source: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const client = generateClient<Schema>();

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [supermarketId, setSupermarketId] = useState<string | null>(null);
  const [error, setError] = useState<{
    message: string;
    source: string;
  } | null>(null);
  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser().catch(() => null);
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error("Error fetching user attributes:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle errors in a consistent way
  const handleError = (error: unknown, source: string) => {
    console.error(`Error in ${source}:`, error);
    let message = "An unexpected error occurred";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (error && typeof error === "object" && "message" in error) {
      message = String((error as any).message);
    }

    setError({ message, source });

    // Auto-clear error after 10 seconds
    setTimeout(() => setError(null), 10000);
  };

  useEffect(() => {
    loadUser();

    const interval = setInterval(async () => {
      const currentUser = await getCurrentUser().catch(() => null);
      if (currentUser) {
        console.log("User detected, fetching attributes...");
        clearInterval(interval); // ✅ Stop polling once user is authenticated
        loadUser();
      }
    }, 3000);

    return () => clearInterval(interval); // ✅ Cleanup interval on component unmount
  }, []); // ✅ Run only once on mount

  // Load supermarket data from backend
  useEffect(() => {
    const loadSupermarketData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // First try to list all supermarkets
        const allSupermarkets = await client.models.Supermarket.list();

        // Get current user
        const currentUser = await getCurrentUser();

        // Find the supermarket that belongs to this user
        const userSupermarket = allSupermarkets.data.find(
          (market) => market.owner === currentUser.userId
        );

        if (userSupermarket) {
          console.log("Found user's supermarket:", userSupermarket.id);
          setSupermarketId(userSupermarket.id);

          // Parse layout from string
          let parsedLayout;
          try {
            // It's stored as a string in the database
            parsedLayout = JSON.parse(userSupermarket.layout);
          } catch (jsonError) {
            handleError(jsonError, "loadSupermarketData (JSON parsing)");
            console.log(
              "Error parsing layout:DashboardContext.tsx - useEffect",
              jsonError
            );
          }

          // Get products for this supermarket
          const products = await client.models.Product.list({
            filter: {
              supermarketID: {
                eq: userSupermarket.id,
              },
            },
          });

          // Set up the supermarket state
          setSupermarket({
            name: userSupermarket.name,
            layout: parsedLayout,
            products: products.data,
          });
        } else {
          console.log("No supermarket found");
          handleError(new Error("No supermarket found"), "loadSupermarketData");

          // Fetch sample products for testing
          // fetchSampleProducts(setSupermarket, setLoading);
        }
      } catch (error) {
        handleError(error, "loadSupermarketData");
      } finally {
        setLoading(false);
      }
    };

    loadSupermarketData();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        supermarket,
        setSupermarket,
        supermarketId,
        setSupermarketId,
        error,
        setError,
        handleError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
