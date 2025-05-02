import { memo, useState } from "react";
import { Square as SquareType } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";
import ProductHoverCard from "./ProductHoverCard";

interface SquareProps {
  square: SquareType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onTouchStart: () => void;
}

// Use memo to prevent unnecessary re-renders
const Square = memo(
  ({ square, onMouseDown, onMouseEnter, onTouchStart }: SquareProps) => {
    const { activeAction } = useDashboard();
    const [showHover, setShowHover] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

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

    // Handle hover events
    const handleMouseOver = (e: React.MouseEvent) => {
      // Only show hover card when not in any edit mode
      if (
        activeAction === EditableAction.None &&
        square.type === "products" &&
        square.productIds.length > 0
      ) {
        setHoverPosition({ x: e.clientX, y: e.clientY });
        setShowHover(true);
      }
    };

    const handleMouseLeave = () => {
      setShowHover(false);
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
        className={`w-full h-full ${getColor()} border rounded-md transition-all relative
        ${activeAction === EditableAction.EditProducts &&
            square.type !== "products"
            ? "opacity-30"
            : ""
          }
        ${activeAction === EditableAction.EditProducts &&
            square.type === "products"
            ? "hover:scale-110 cursor-pointer active:scale-105"
            : isInteractive
              ? "cursor-pointer hover:opacity-80 active:opacity-70"
              : ""
          }
        ${isSelected ? "ring-4 ring-sky-600 z-10" : ""}
        ${square.type === "products" && square.productIds.length > 0 && activeAction === EditableAction.None
            ? "hover:ring-2 hover:ring-green-500"
            : ""}
        `}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        data-square-type={square.type}
        data-position={`${square.row},${square.col}`}
      >
        {/* Show a small indicator if the square contains products */}
        {square.type === "products" && square.productIds.length > 0 && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full -mt-1 -mr-1">
            {square.productIds.length > 9 ? "9+" : square.productIds.length}
          </div>
        )}

        {/* Product hover card */}
        {showHover && (
          <ProductHoverCard
            square={square}
            position={hoverPosition}
          />
        )}
      </div>
    );
  }
);

// Add a display name for debugging
Square.displayName = "Square";

export default Square;