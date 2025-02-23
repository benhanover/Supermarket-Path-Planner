import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SquareType, Square, Product, Supermarket } from "./types";
import { User } from "../../types/user";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const createInitialSupermarket = (user: User): Supermarket => ({
  id: Date.now(),
  name: user.supermarketName,
  address: user.address,
  layout: {
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
  },
  products: [],
});

export enum EditableAction {
  None = "none",
  ModifyLayout = "modify_layout",
  EditProducts = "edit_products",
  ChangeLayoutSize = "change_layout_size",
}

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

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: userLoading } = useAppContext();

  // Use lazy initial state to avoid unnecessary re-computations
  const [supermarket, setSupermarket] = useState<Supermarket | null>(() =>
    user ? createInitialSupermarket(user) : null
  );

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

  // Initialize supermarket products once
  const initializeSupermarket = useCallback(async () => {
    if (!user || supermarket?.products.length) return;

    setLoading(true);
    try {
      const response = await axios.get<Product[]>(
        "https://fakestoreapi.com/products"
      );

      setSupermarket((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          products: response.data,
        };
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [user, supermarket?.products.length]);

  // Initialize supermarket when user changes
  useEffect(() => {
    if (user && !supermarket) {
      setSupermarket(createInitialSupermarket(user));
    }
  }, [user, supermarket]);

  // Fetch products when supermarket is created
  useEffect(() => {
    if (supermarket && !supermarket.products.length) {
      initializeSupermarket();
    }
  }, [supermarket, initializeSupermarket]);

  const handleSquareClick = useCallback(
    (row: number, col: number, trigger: "mouse_down" | "mouse_enter") => {
      if (!supermarket) return;

      const clickedSquare = supermarket.layout.grid[row][col];

      if (activeAction === EditableAction.ModifyLayout) {
        setSupermarket((prevSupermarket) => {
          if (!prevSupermarket) return prevSupermarket;

          const updatedGrid = prevSupermarket.layout.grid.map((r) =>
            r.map((square) =>
              square.row === row && square.col === col
                ? { ...square, type: selectedType }
                : square
            )
          );

          return {
            ...prevSupermarket,
            layout: { ...prevSupermarket.layout, grid: updatedGrid },
          };
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
    },
    [supermarket, activeAction, selectedType, editMode]
  );

  if (userLoading) {
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
