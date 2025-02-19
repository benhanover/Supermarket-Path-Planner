import { createContext, useContext, useState, ReactNode } from "react";
import { Layout as LayoutType } from "../../types/layout";
import { SquareType } from "../../types/square";

const ROWS = 20;
const COLS = 30;

const createInitialLayout = (): LayoutType => ({
  rows: ROWS,
  cols: COLS,
  grid: Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      type: "empty",
      products: [],
      row,
      col,
    }))
  ),
});

// Define the shape of the context
interface DashboardContextType {
  layout: LayoutType;
  setLayout: React.Dispatch<React.SetStateAction<LayoutType>>;
  selectedType: SquareType;
  setSelectedType: (type: SquareType) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  handleSquareClick: (row: number, col: number) => void;
}

// Create the context with default values
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<LayoutType>(createInitialLayout);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(true);

  const handleSquareClick = (row: number, col: number) => {
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
        handleSquareClick,
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
