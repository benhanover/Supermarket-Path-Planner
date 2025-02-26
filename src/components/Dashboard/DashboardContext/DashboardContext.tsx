import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SquareType, Square, EditableAction, Supermarket } from "../types";
import { useAppContext } from "../../../context/AppContext";
import { fetchProducts } from "./dashboardApi";
import { handleSquareClick as handleSquareClickAction } from "./dashboardActions";

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
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Create initial supermarket function
const createInitialSupermarket = (user: {
  layoutRows: number;
  layoutCols: number;
  supermarketName: string;
}): Supermarket => {
  console.log(
    `Creating initial supermarket: ${user.layoutRows}x${user.layoutCols}`
  );
  return {
    name: user.supermarketName,
    products: [],
    layout: Array.from({ length: user.layoutRows }, (_, row) =>
      Array.from({ length: user.layoutCols }, (_, col) => ({
        type: "empty",
        products: [],
        row,
        col,
      }))
    ),
  };
};

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
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

  // Initialize supermarket when user data is available
  useEffect(() => {
    if (user) {
      console.log("User data available, initializing supermarket");
      setSupermarket(createInitialSupermarket(user));
    }
  }, [user]);

  // Fetch products when supermarket is initialized
  useEffect(() => {
    if (user && supermarket) {
      console.log("Fetching products for supermarket");
      fetchProducts(setSupermarket, setLoading);
    }
  }, [user, supermarket?.name]); // Only re-run when supermarket name changes, not the entire supermarket

  // Define handleSquareClick as a memoized function to prevent unnecessary re-renders
  const handleSquareClick = useCallback(
    (row: number, col: number, trigger: "mouse_down" | "mouse_enter") => {
      console.log(
        `handleSquareClick called: row=${row}, col=${col}, trigger=${trigger}`
      );
      console.log(
        `Current active action: ${activeAction}, Selected type: ${selectedType}`
      );

      if (!supermarket) {
        console.error("Supermarket is null in handleSquareClick");
        return;
      }

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
    },
    [supermarket, activeAction, selectedType, setEditMode, setActiveTab]
  );

  // Loading state
  if (userLoading || !supermarket) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  console.log("Rendering DashboardProvider with current state:");
  console.log(`- Edit mode: ${editMode}`);
  console.log(`- Active action: ${activeAction}`);
  console.log(`- Selected type: ${selectedType}`);
  console.log(`- Active tab: ${activeTab}`);

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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
