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
  const [error, setError] = useState<{
    message: string;
    source: string;
  } | null>(null);

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
    // Set loading to true initially
    setLoading(true);

    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser().catch(() => null);
        if (currentUser) {
          console.log("User authenticated, setting user state");
          setUser(currentUser);
        } else {
          console.log("No authenticated user found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadSupermarketData = async () => {
      if (!user || loading) return;

      try {
        console.log("Loading supermarket data for user:", user.userId);
        setLoading(true);
        setError(null);

        // Get all supermarkets
        const allSupermarkets = await client.models.Supermarket.list();
        console.log(allSupermarkets);

        // Find the supermarket that belongs to this user
        const userSupermarket = allSupermarkets.data.find(
          (market) => market.owner === user.userId
        );

        if (userSupermarket) {
          let parsedLayout;
          try {
            if (typeof userSupermarket.layout === "string") {
              parsedLayout = JSON.parse(userSupermarket.layout);
            }
          } catch (jsonError) {
            handleError(jsonError, "loadSupermarketData (JSON parsing)");
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
            id: userSupermarket.id,
            owner: userSupermarket.owner,
            name: userSupermarket.name,
            layout: parsedLayout,
            products: products.data,
          });
        } else {
          console.log("No supermarket found for user");
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
