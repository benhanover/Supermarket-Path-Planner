import { createContext, useContext, useState, ReactNode } from "react";
import { Layout as LayoutType, SquareType, Square } from "./types";
import { products } from "./types/product";

const ROWS = 20;
const COLS = 30;

const createInitialLayout = (): LayoutType => ({
  rows: ROWS,
  cols: COLS,
  grid: Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      type: "empty",
      // products: [],
      products: products,
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
  handleSquareClick: (row: number, col: number) => void;
  selectedSquare: Square | null;
  setSelectedSquare: React.Dispatch<React.SetStateAction<Square | null>>;
}

// Create the context with default values
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<LayoutType>(createInitialLayout);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(true);
  // const [activeAction, setActiveAction] = useState<EditableAction>("none");
  const [activeAction, setActiveAction] = useState<EditableAction>(
    EditableAction.None
  );
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const handleSquareClick = (row: number, col: number) => {
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
      clickedSquare.type === "products"
      // clickedSquare.type === "aisle"
    ) {
      setSelectedSquare(clickedSquare);
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
