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
import { computePathDataForLayout } from "../../../utils/pathOptimization";
import { persistPathData } from "./pathApi";
import { Product } from "../types";

interface DashboardContextType {
  selectedType: SquareType;
  setSelectedType: (type: SquareType) => void;
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
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  saveLayout: (layoutToSave?: Square[][]) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<string>;
  updateProductData: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  isComputingPaths: boolean;
  triggerPathRecompute: () => void;
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { supermarket, setSupermarket, error, setError, handleError } =
    useAppContext();

  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isComputingPaths, setIsComputingPaths] = useState(false);
  const [pathComputeTimeout, setPathComputeTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      if (pathComputeTimeout) {
        clearTimeout(pathComputeTimeout);
      }
    };
  }, [saveTimeout, pathComputeTimeout]);

  const runPathComputation = useCallback(async () => {
    if (!supermarket?.layout || !supermarket?.id) return;
    try {
      setIsComputingPaths(true);
      const pathData = computePathDataForLayout(supermarket.layout);
      // Update local state first
      setSupermarket((prev) => (prev ? { ...prev, pathData } : prev));
      // Persist in background
      await persistPathData(supermarket.id, pathData);
    } catch (error) {
      console.error("Error computing path data:", error);
      // Non-fatal; leave previous pathData intact
    } finally {
      setIsComputingPaths(false);
    }
  }, [supermarket, setSupermarket]);

  const triggerPathRecompute = useCallback(() => {
    if (pathComputeTimeout) clearTimeout(pathComputeTimeout);
    const t = setTimeout(() => {
      runPathComputation();
    }, 1000);
    setPathComputeTimeout(t);
  }, [pathComputeTimeout, runPathComputation]);

  // Wrapper around the API saveLayout function
  const saveLayout = async (layoutToSave?: Square[][]) => {
    if (!supermarket) return;
    try {
      await saveLayoutApi(supermarket, layoutToSave, setError, setIsSaving);
      // After persisting layout, trigger path recompute (debounced)
      triggerPathRecompute();
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
      // Product data changes may affect path choices; recompute
      triggerPathRecompute();
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
      // Removing products from squares/layout can affect graph; recompute
      triggerPathRecompute();
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
          // Also trigger debounced path recompute (coalesced)
          triggerPathRecompute();
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
      setActiveTab,
      saveTimeout,
      triggerPathRecompute,
    ]
  );

  // // Loading state
  // if (loading || !supermarket) {
  //   return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  // }

  return (
    <DashboardContext.Provider
      value={{
        // supermarket,
        // setSupermarket,
        selectedType,
        setSelectedType,
        activeAction,
        setActiveAction,
        handleSquareClick,
        selectedSquare,
        setSelectedSquare,
        activeTab,
        setActiveTab,
        isSaving,
        setIsSaving,
        saveLayout,
        addProduct,
        updateProductData,
        removeProduct,
        isComputingPaths,
        triggerPathRecompute,
      }}
    >
      {isComputingPaths && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg shadow-md z-40 flex items-center space-x-2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Computing paths...</span>
        </div>
      )}
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
