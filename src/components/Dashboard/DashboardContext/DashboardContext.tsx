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
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import axios from "axios";
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
          fetchSampleProducts();
        }
      } catch (error) {
        handleError(error, "loadSupermarketData");
      } finally {
        setLoading(false);
      }
    };

    loadSupermarketData();
  }, [user]);

  // Fetch sample products if needed
  const fetchSampleProducts = async () => {
    try {
      setError(null);
      const response = await axios.get<Product[]>(
        "https://fakestoreapi.com/products"
      );
      setSupermarket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: response.data.map((product) => ({
            ...product,
            id: product.id.toString(), // Convert to string for compatibility
          })),
        };
      });
    } catch (error) {
      handleError(error, "fetchSampleProducts");
    }
  };

  // Save layout to backend
  const saveLayout = async (layoutToSave?: Square[][]) => {
    if (!supermarket) return;

    try {
      setError(null);
      // Use the provided layout parameter if available, otherwise use the current state
      const layoutData = layoutToSave || supermarket.layout;
      // Format the layout data as a string for storage
      const layoutString = JSON.stringify(layoutData);
      console.log("Saving layout:", layoutString.substring(0, 100) + "...");

      if (supermarketId) {
        // Update the existing supermarket
        await client.models.Supermarket.update({
          id: supermarketId,
          layout: layoutString,
        });
      } else {
        // Create a new supermarket if we don't have an ID
        console.log("Creating new supermarket");
        const currentUser = await getCurrentUser();
        const newSupermarket = await client.models.Supermarket.create({
          name: supermarket.name,
          address: user?.address || "Address not set",
          layout: layoutString,
          owner: currentUser.userId,
        });

        setSupermarketId(newSupermarket.id);
      }
    } catch (error) {
      handleError(error, "saveLayout");
      throw error; // Re-throw for caller to handle
    }
  };

  // Add a product to the backend
  const addProduct = async (product: Omit<Product, "id">) => {
    if (!supermarketId) {
      // If we don't have a supermarket ID yet, create the supermarket first
      try {
        await saveLayout();
      } catch (error) {
        handleError(error, "addProduct (saveLayout)");
        throw error;
      }

      if (!supermarketId) {
        const error = new Error("Failed to create supermarket");
        handleError(error, "addProduct");
        throw error;
      }
    }

    try {
      setError(null);
      // Create the product in the database
      const newProduct = await client.models.Product.create({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        rating: JSON.stringify(product.rating),
        supermarketID: supermarketId,
      });

      // Update the local state with the new product
      setSupermarket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: [
            ...prev.products,
            { ...newProduct, rating: product.rating },
          ],
        };
      });

      return newProduct.id;
    } catch (error) {
      handleError(error, "addProduct");
      throw error;
    }
  };

  // Update a product in the backend
  const updateProductData = async (product: Product) => {
    try {
      setError(null);
      // Update the product in the database
      await client.models.Product.update({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });

      // Update local state
      setSupermarket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.map((p) =>
            p.id === product.id ? product : p
          ),
          // Also update in any square that has this product
          layout: prev.layout.map((row) =>
            row.map((square) => ({
              ...square,
              products: square.products.map((p) =>
                p.id === product.id ? product : p
              ),
            }))
          ),
        };
      });

      // Update selected square if it contains this product
      if (selectedSquare) {
        const updatedProducts = selectedSquare.products.map((p) =>
          p.id === product.id ? product : p
        );
        setSelectedSquare({ ...selectedSquare, products: updatedProducts });
      }
    } catch (error) {
      handleError(error, "updateProductData");
      throw error;
    }
  };

  // Remove a product from the backend
  const removeProduct = async (productId: string) => {
    try {
      setError(null);
      // Delete the product from the database
      await client.models.Product.delete({ id: productId });

      // Update local state
      setSupermarket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.filter((p) => p.id !== productId),
          // Also remove from any square that has this product
          layout: prev.layout.map((row) =>
            row.map((square) => ({
              ...square,
              products: square.products.filter((p) => p.id !== productId),
            }))
          ),
        };
      });

      // Update selected square if it contains this product
      if (selectedSquare) {
        const updatedProducts = selectedSquare.products.filter(
          (p) => p.id !== productId
        );
        setSelectedSquare({ ...selectedSquare, products: updatedProducts });
      }
    } catch (error) {
      handleError(error, "removeProduct");
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

          // Auto-save the updated layout
          const debounceTimeout = setTimeout(() => {
            saveLayout(updatedLayout).catch((error) => {
              handleError(error, "handleSquareClick (saveLayout)");
            });
          }, 1000);

          return () => clearTimeout(debounceTimeout);
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
    [supermarket, activeAction, selectedType, setEditMode, setActiveTab]
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
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
