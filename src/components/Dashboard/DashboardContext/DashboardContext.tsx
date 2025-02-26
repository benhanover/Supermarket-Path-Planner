import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SquareType, Square, EditableAction, Supermarket } from "../types";
import { useAppContext } from "../../../context/AppContext";
import { handleSquareClick as handleSquareClickAction } from "./dashboardActions";
import {
  fetchSampleProducts,
  saveLayout as saveLayoutApi,
  addProduct as addProductApi,
  updateProductData as updateProductApi,
  removeProduct as removeProductApi,
} from "./dashboardApi";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { Product } from "../types";
import type { Schema } from "../../../../amplify/data/resource";

interface DashboardContextType {
  supermarket: Supermarket | null;
  setSupermarket: React.Dispatch<React.SetStateAction<Supermarket | null>>;
  selectedType: SquareType;
  setSelectedType: (type: SquareType) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  activeAction: EditableAction;
  setActiveAction: (action: EditableAction) => void;
  handleSquareClick: (
    row: number,
    col: number,
    trigger: "mouse_down" | "mouse_enter"
  ) => void;
  selectedSquare: Square | null;
  setSelectedSquare: React.Dispatch<React.SetStateAction<Square | null>>;
  activeTab: "layout" | "products" | "product_square";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"layout" | "products" | "product_square">
  >;
  loading: boolean;
  isSaving: boolean;
  saveLayout: (layoutToSave?: Square[][]) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<string>;
  updateProductData: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  supermarketId: string | null;
  error: { message: string; source: string } | null;
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const client = generateClient<Schema>();

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [supermarketId, setSupermarketId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<{
    message: string;
    source: string;
  } | null>(null);

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
            // Create a default layout if parsing fails
            parsedLayout = Array.from({ length: user.layoutRows }, (_, row) =>
              Array.from({ length: user.layoutCols }, (_, col) => ({
                type: "empty" as SquareType,
                products: [],
                row,
                col,
              }))
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
          // Create a default supermarket in memory
          const emptyLayout = Array.from(
            { length: user.layoutRows },
            (_, row) =>
              Array.from({ length: user.layoutCols }, (_, col) => ({
                type: "empty" as SquareType,
                products: [],
                row,
                col,
              }))
          );

          setSupermarket({
            name: user.supermarketName || "My Supermarket",
            layout: emptyLayout,
            products: [],
          });

          // Fetch sample products for testing
          fetchSampleProducts(setSupermarket, setLoading);
        }
      } catch (error) {
        handleError(error, "loadSupermarketData");
      } finally {
        setLoading(false);
      }
    };

    loadSupermarketData();
  }, [user]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // Wrapper around the API saveLayout function
  const saveLayout = async (layoutToSave?: Square[][]) => {
    if (!supermarket) return;
    try {
      await saveLayoutApi(
        supermarket,
        supermarketId,
        layoutToSave,
        user,
        setSupermarketId,
        setError,
        setIsSaving
      );
    } catch (error) {
      // Error handling is done within the API function
      console.error("Error in saveLayout:", error);
    }
  };

  // Wrapper around the API addProduct function
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      return await addProductApi(
        product,
        supermarketId,
        saveLayout,
        setSupermarket,
        setError,
        setIsSaving
      );
    } catch (error) {
      // Error handling is done within the API function
      console.error("Error in addProduct:", error);
      throw error;
    }
  };

  // Wrapper around the API updateProductData function
  const updateProductData = async (product: Product) => {
    try {
      await updateProductApi(
        product,
        supermarketId,
        setSupermarket,
        setSelectedSquare,
        selectedSquare,
        setError,
        setIsSaving
      );
    } catch (error) {
      // Error handling is done within the API function
      console.error("Error in updateProductData:", error);
      throw error;
    }
  };

  // Wrapper around the API removeProduct function
  const removeProduct = async (productId: string) => {
    try {
      await removeProductApi(
        productId,
        setSupermarket,
        setSelectedSquare,
        selectedSquare,
        setError,
        setIsSaving
      );
    } catch (error) {
      // Error handling is done within the API function
      console.error("Error in removeProduct:", error);
      throw error;
    }
  };

  // Define handleSquareClick
  const handleSquareClick = useCallback(
    (row: number, col: number, trigger: "mouse_down" | "mouse_enter") => {
      if (!supermarket) return;

      try {
        // Create a copy of the current layout
        let updatedLayout: Square[][] | null = null;

        if (activeAction === EditableAction.ModifyLayout) {
          // Create a deep copy of the layout
          updatedLayout = supermarket.layout.map((rowArray) =>
            rowArray.map((square) => ({ ...square }))
          );

          // Update the specific square
          updatedLayout[row][col] = {
            ...updatedLayout[row][col],
            type: selectedType,
          };

          // Update the state
          setSupermarket((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              layout: updatedLayout!,
            };
          });

          // Clear existing timeout if there is one
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }

          // Set new debounced save timeout
          const newTimeout = setTimeout(() => {
            saveLayout(updatedLayout).catch((error) => {
              handleError(error, "handleSquareClick (saveLayout)");
            });
          }, 1000);

          setSaveTimeout(newTimeout);
        } else {
          // For other actions, use the original implementation
          handleSquareClickAction(
            row,
            col,
            trigger,
            supermarket,
            setSupermarket,
            activeAction,
            selectedType,
            setSelectedSquare,
            setEditMode,
            setActiveTab
          );
        }
      } catch (error) {
        handleError(error, "handleSquareClick");
      }
    },
    [
      supermarket,
      activeAction,
      selectedType,
      setEditMode,
      setActiveTab,
      saveTimeout,
    ]
  );

  // Loading state
  if (userLoading || !supermarket) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <DashboardContext.Provider
      value={{
        supermarket,
        setSupermarket,
        selectedType,
        setSelectedType,
        editMode,
        setEditMode,
        activeAction,
        setActiveAction,
        handleSquareClick,
        selectedSquare,
        setSelectedSquare,
        activeTab,
        setActiveTab,
        loading,
        isSaving,
        saveLayout,
        addProduct,
        updateProductData,
        removeProduct,
        supermarketId,
        error,
      }}
    >
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg max-w-md">
          <strong className="font-bold">Error in {error.source}:</strong>
          <span className="block sm:inline"> {error.message}</span>
          <button
            className="absolute top-0 right-0 px-2 py-1"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      {/* Saving indicator - pointer-events-none ensures it doesn't interfere with drag operations */}
      {isSaving && (
        <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-lg shadow-md z-40 flex items-center space-x-2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Saving changes...</span>
        </div>
      )}
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
