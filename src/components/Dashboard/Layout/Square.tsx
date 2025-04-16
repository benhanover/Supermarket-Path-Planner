import { memo } from "react";
import { Square as SquareType } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";

interface SquareProps {
  square: SquareType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onTouchStart: () => void;
}

// Use memo to prevent unnecessary re-renderss
const Square = memo(
  ({ square, onMouseDown, onMouseEnter, onTouchStart }: SquareProps) => {
    const { activeAction } = useDashboard();

    const getColor = () => {
      switch (square.type) {
        case "products":
          return "bg-green-300 border-green-300";
        case "cash_register":
          return "bg-amber-200 border-amber-200";
        case "entrance":
          return "bg-blue-400 border-blue-400";
        case "exit":
          return "bg-rose-400 border-red-400";
        default:
          return "bg-gray-200 border-gray-300";
      }
    };

    const handleMouseDown = () => {
      onMouseDown(square.row, square.col);
    };

    const handleMouseEnter = () => {
      onMouseEnter(square.row, square.col);
    };

    // Determine if square should be interactive based on active action
    const isInteractive =
      activeAction === EditableAction.ModifyLayout ||
      (activeAction === EditableAction.EditProducts &&
        square.type === "products");

    const { selectedSquare } = useDashboard();
    const isSelected =
      selectedSquare?.row === square.row && selectedSquare?.col === square.col;

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
          ? "hover:scale-110 cursor-pointer active:scale-105"
          : isInteractive
          ? "cursor-pointer hover:opacity-80 active:opacity-70"
          : ""
      }
          ${isSelected ? "ring-4 ring-sky-600 z-10" : ""}
      `}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onTouchStart={onTouchStart}
        data-square-type={square.type}
        data-position={`${square.row},${square.col}`}
      ></div>
    );
  }
);

// Add a display name for debugging
Square.displayName = "Square";

export default Square;
