import { useEffect, memo } from "react";
import { Square as SquareType } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";

interface SquareProps {
  square: SquareType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}

// Use memo to prevent unnecessary re-renders
const Square = memo(({ square, onMouseDown, onMouseEnter }: SquareProps) => {
  const { activeAction } = useDashboard();

  // Debug when square type changes
  useEffect(() => {
    console.log(
      `Square at (${square.row},${square.col}) rendered with type: ${square.type}`
    );
  }, [square.type, square.row, square.col]);

  const getColor = () => {
    switch (square.type) {
      case "products":
        return "bg-green-500 border-gray-600";
      case "cash_register":
        return "bg-yellow-500 border-green-700";
      case "entrance":
        return "bg-blue-500 border-blue-700";
      case "exit":
        return "bg-red-500 border-red-700";
      default:
        return "bg-gray-200 border-gray-300";
    }
  };

  const handleMouseDown = () => {
    console.log(
      `Mouse down on square at (${square.row},${square.col}), current type: ${square.type}`
    );
    onMouseDown(square.row, square.col);
  };

  const handleMouseEnter = () => {
    console.log(
      `Mouse enter on square at (${square.row},${square.col}), current type: ${square.type}`
    );
    onMouseEnter(square.row, square.col);
  };

  // Determine if square should be interactive based on active action
  const isInteractive =
    activeAction === EditableAction.ModifyLayout ||
    (activeAction === EditableAction.EditProducts &&
      square.type === "products");

  return (
    <div
      className={`w-full h-full ${getColor()} border rounded-md transition-all 
      ${
        activeAction === EditableAction.EditProducts &&
        square.type !== "products"
          ? "opacity-30"
          : ""
      }
      ${
        activeAction === EditableAction.EditProducts &&
        square.type === "products"
          ? "hover:scale-110 cursor-pointer"
          : isInteractive
          ? "cursor-pointer hover:opacity-80"
          : ""
      }
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      data-square-type={square.type}
      data-position={`${square.row},${square.col}`}
    ></div>
  );
});

// Add a display name for debugging
Square.displayName = "Square";

export default Square;
