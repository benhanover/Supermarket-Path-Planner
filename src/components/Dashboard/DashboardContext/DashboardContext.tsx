import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SquareType, Square, EditableAction } from "../types";
import { useAppContext } from "../../../context/AppContext";
import { handleSquareClick as handleSquareClickAction } from "./dashboardActions";
import {
  // fetchSampleProducts,
  saveLayout as saveLayoutApi,
  addProduct as addProductApi,
  updateProductData as updateProductApi,
  removeProduct as removeProductApi,
} from "./dashboardApi";
import { Product } from "../types";

interface DashboardContextType {
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
  isSaving: boolean;
  saveLayout: (layoutToSave?: Square[][]) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<string>;
  updateProductData: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const {
    loading: userLoading,
    supermarket,
    setSupermarket,
    error,
    setError,
    handleError,
  } = useAppContext();

  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

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
      await saveLayoutApi(supermarket, layoutToSave, setError, setIsSaving);
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
        supermarket,
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
        supermarket,
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
        let updatedLayout: Square[][] | undefined = undefined;

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
        // supermarket,
        // setSupermarket,
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
        isSaving,
        saveLayout,
        addProduct,
        updateProductData,
        removeProduct,
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
