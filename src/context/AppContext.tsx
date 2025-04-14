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

const AppContext = createContext<AppContextType | undefined>(undefined);
const client = generateClient<Schema>();

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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; source: string } | null>(null);

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

    setTimeout(() => setError(null), 10000);
  };

  useEffect(() => {
    const loadUserAndSupermarketData = async () => {
      setLoading(true);

      try {
        // Load User
        const currentUser = await getCurrentUser().catch(() => null);
        setUser(currentUser);

        if (!currentUser) {
          return; // No user → skip supermarket fetch
        }

        // Load Supermarket
        const allSupermarkets = await client.models.Supermarket.list();
        const userSupermarket = allSupermarkets.data.find(
          (market) => market.owner === currentUser.userId
        );

        if (userSupermarket) {
          let parsedLayout;

          try {
            parsedLayout =
              typeof userSupermarket.layout === "string"
                ? JSON.parse(userSupermarket.layout)
                : userSupermarket.layout;
          } catch (jsonError) {
            handleError(jsonError, "loadSupermarketData (JSON parsing)");
          }

          const products = await client.models.Product.list({
            filter: { supermarketID: { eq: userSupermarket.id } },
          });

          setSupermarket({
            id: userSupermarket.id,
            owner: userSupermarket.owner,
            name: userSupermarket.name,
            layout: parsedLayout,
            products: products.data,
          });
        }
      } catch (error) {
        handleError(error, "loadUserAndSupermarketData");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndSupermarketData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        supermarket,
        setSupermarket,
        loading,
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
