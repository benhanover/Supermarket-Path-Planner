import { memo, useState, useRef, useEffect } from "react";
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

const Square = memo(({ square, onMouseDown, onMouseEnter, onTouchStart }: SquareProps) => {
  const { activeAction, selectedSquare } = useDashboard();
  const [showHover, setShowHover] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const squareRef = useRef<HTMLDivElement | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const isProductSquare = square.type === "products" && square.productIds.length > 0;
  const isSelected =
    selectedSquare?.row === square.row && selectedSquare?.col === square.col;

  const handleMouseDown = () => onMouseDown(square.row, square.col);

  const handleMouseEnterSquare = () => {
    onMouseEnter(square.row, square.col);

    if (activeAction === EditableAction.None && isProductSquare) {
      const rect = squareRef.current?.getBoundingClientRect();
      if (rect) {
        setHoverPos({
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8, // מופיע מתחת לריבוע
        });
        setShowHover(true);
      }
    }
  };

  const handleMouseLeaveSquare = () => {
    hideTimeout.current = setTimeout(() => setShowHover(false), 150);
  };

  // נקי Timeout כשמרכיב נעלם
  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const getColor = () => {
    switch (square.type) {
      case "products": return "bg-green-300 border-green-300";
      case "cash_register": return "bg-amber-200 border-amber-200";
      case "entrance": return "bg-blue-400 border-blue-400";
      case "exit": return "bg-rose-400 border-red-400";
      default: return "bg-gray-200 border-gray-300";
    }
  };

  const isInteractive =
    activeAction === EditableAction.ModifyLayout ||
    (activeAction === EditableAction.EditProducts && square.type === "products");

  return (
    <div
      ref={squareRef}
      className={`w-full h-full ${getColor()} border rounded-md transition-all relative
        ${activeAction === EditableAction.EditProducts && square.type !== "products" ? "opacity-30" : ""}
        ${isInteractive ? "cursor-pointer hover:opacity-80 active:opacity-70" : ""}
        ${isSelected ? "ring-4 ring-sky-600 z-10" : ""}
        ${isProductSquare && activeAction === EditableAction.None ? "hover:ring-2 hover:ring-green-500" : ""}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnterSquare}
      onMouseLeave={handleMouseLeaveSquare}
      onTouchStart={onTouchStart}
    >
      {isProductSquare && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full -mt-1 -mr-1">
          {square.productIds.length > 9 ? "9+" : square.productIds.length}
        </div>
      )}

      {showHover && (
        <ProductHoverCard
          square={square}
          position={hoverPos}
          onMouseEnter={() => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
            setShowHover(true);
          }}
          onMouseLeave={() => {
            hideTimeout.current = setTimeout(() => setShowHover(false), 150);
          }}
        />
      )}
    </div>
  );
});

Square.displayName = "Square";
export default Square;
