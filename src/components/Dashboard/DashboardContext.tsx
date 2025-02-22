import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Layout as LayoutType, SquareType, Square } from "./types";
import { Product } from "./types/product"; // ✅ Import Product type
import axios from "axios"; // ✅ Import Axios

const ROWS = 20;
const COLS = 30;

const createInitialLayout = (): LayoutType => ({
  rows: ROWS,
  cols: COLS,
  grid: Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      type: "empty",
      products: [], // ✅ No predefined products
      row,
      col,
    }))
  ),
});

export enum EditableAction {
  None = "none",
  ModifyLayout = "modify_layout",
  EditProducts = "edit_products",
}

interface DashboardContextType {
  layout: LayoutType;
  setLayout: React.Dispatch<React.SetStateAction<LayoutType>>;
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
  products: Product[]; // ✅ Store fetched products
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // ✅ Allow updates
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<LayoutType>(createInitialLayout);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeTab, setActiveTab] = useState<
    "layout" | "products" | "product_square"
  >("layout");
  const [products, setProducts] = useState<Product[]>([]); // ✅ Products state

  // ✅ Fetch products from API when component mounts
  useEffect(() => {
    axios
      .get<Product[]>("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data); // ✅ Store products in state
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleSquareClick = (
    row: number,
    col: number,
    trigger: "mouse_down" | "mouse_enter"
  ) => {
    const clickedSquare = layout.grid[row][col];

    if (activeAction === "modify_layout") {
      setLayout((prevLayout) => {
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
      activeAction === "edit_products" &&
      clickedSquare.type === "products" &&
      trigger === "mouse_down"
    ) {
      setSelectedSquare(clickedSquare);
      setEditMode(!editMode);
      setActiveTab("product_square");
    }
  };

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
        products, // ✅ Provide products
        setProducts, // ✅ Provide setter
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for using the context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
