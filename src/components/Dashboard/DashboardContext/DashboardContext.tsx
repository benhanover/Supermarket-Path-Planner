// src/components/Dashboard/DashboardContext/DashboardContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import {
  SquareType,
  Square,
  Product,
  EditableAction,
  Layout as LayoutType,
} from "../types";
import { useAppContext } from "../../../context/AppContext";
import { fetchProducts } from "./dashboardApi";
import { handleSquareClick } from "./dashboardActions";

interface DashboardContextType {
  layout: LayoutType | null;
  setLayout: React.Dispatch<React.SetStateAction<LayoutType | null>>;
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
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Create initial layout function
const createInitialLayout = (user: {
  layoutRows: number;
  layoutCols: number;
}): LayoutType => ({
  rows: user.layoutRows,
  cols: user.layoutCols,
  grid: Array.from({ length: user.layoutRows }, (_, row) =>
    Array.from({ length: user.layoutCols }, (_, col) => ({
      type: "empty",
      products: [],
      row,
      col,
    }))
  ),
});

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();
  const [layout, setLayout] = useState<LayoutType | null>(null);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize layout when user data is available
  useEffect(() => {
    if (user) {
      setLayout(createInitialLayout(user));
    }
  }, [user]);

  // Fetch products when component mounts
  useEffect(() => {
    if (user) {
      fetchProducts(setProducts, setLoading);
    }
  }, [user]);

  // Loading state
  if (userLoading || !layout) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  return (
    <DashboardContext.Provider
      value={{
        layout,
        setLayout,
        selectedType,
        setSelectedType,
        editMode,
        setEditMode,
        activeAction,
        setActiveAction,
        handleSquareClick: (row, col, trigger) =>
          handleSquareClick(
            row,
            col,
            trigger,
            layout,
            setLayout,
            activeAction,
            selectedType,
            setSelectedSquare,
            setEditMode,
            setActiveTab
          ),
        selectedSquare,
        setSelectedSquare,
        activeTab,
        setActiveTab,
        products,
        setProducts,
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
