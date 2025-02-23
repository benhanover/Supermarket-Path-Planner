import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Layout as LayoutType, SquareType, Square } from "./types";
import { Product } from "./types/product";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

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

export enum EditableAction {
  None = "none",
  ModifyLayout = "modify_layout",
  EditProducts = "edit_products",
  ChangeLayoutSize = "change_layout_size",
}

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

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

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

  useEffect(() => {
    if (user) {
      setLayout(createInitialLayout(user));
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await axios.get<Product[]>(
          "https://fakestoreapi.com/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleSquareClick = (
    row: number,
    col: number,
    trigger: "mouse_down" | "mouse_enter"
  ) => {
    if (!layout) return;

    const clickedSquare = layout.grid[row][col];

    if (activeAction === EditableAction.ModifyLayout) {
      setLayout((prevLayout) => {
        if (!prevLayout) return null;
        const newGrid = prevLayout.grid.map((r) =>
          r.map((square) =>
            square.row === row && square.col === col
              ? { ...square, type: selectedType }
              : square
          )
        );
        return { ...prevLayout, grid: newGrid };
      });
    } else if (
      activeAction === EditableAction.EditProducts &&
      clickedSquare.type === "products" &&
      trigger === "mouse_down"
    ) {
      setSelectedSquare(clickedSquare);
      setEditMode(!editMode);
      setActiveTab("product_square");
    }
  };

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
        handleSquareClick,
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

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
