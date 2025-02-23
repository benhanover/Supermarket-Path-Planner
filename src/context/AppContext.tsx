import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { User } from "../types/user";

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserAttributes = async () => {
    try {
      const currentUser = await getCurrentUser().catch(() => null);
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const attributes = await fetchUserAttributes();

      const formattedUser: User = {
        address: attributes.address || "",
        birthdate: attributes.birthdate || "",
        layoutCols: parseInt(attributes["custom:layout_cols"] || "30"),
        layoutRows: parseInt(attributes["custom:layout_rows"] || "50"),
        email: attributes.email || "",
        emailVerified: attributes.email_verified === "true",
        supermarketName: attributes["custom:supermarket_name"] || "",
        sub: attributes.sub || "",
      };

      setUser(formattedUser);
    } catch (error) {
      console.error("Error fetching user attributes:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAttributes(); // ✅ Load user attributes on component mount

    // ✅ Poll authentication state every 3 seconds
    const interval = setInterval(async () => {
      const currentUser = await getCurrentUser().catch(() => null);
      if (currentUser) {
        console.log("User detected, fetching attributes...");
        clearInterval(interval); // ✅ Stop polling once user is authenticated
        loadUserAttributes();
      }
    }, 3000);

    return () => clearInterval(interval); // ✅ Cleanup interval on component unmount
  }, []); // ✅ Run only once on mount

  return (
    <AppContext.Provider value={{ user, setUser, loading }}>
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
