import { useState } from "react";
import { useDashboard } from "../DashboardContext";
import Square from "./Square";

const SQUARE_SIZE = 24; // Adjust for bigger squares

const Layout = () => {
  const { supermarket, handleSquareClick } = useDashboard(); // ✅ Use supermarket instead of layout
  const [isDragging, setIsDragging] = useState(false);

  if (!supermarket?.layout) {
    return <div className="text-center text-gray-500">Loading layout...</div>;
  }

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    supermarket &&
      supermarket.layout &&
      handleSquareClick(row, col, "mouse_down");
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging && supermarket?.layout) {
      handleSquareClick(row, col, "mouse_enter");
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden">
      <div
        className="p-4 overflow-auto border border-gray-300 shadow-lg rounded-lg bg-white"
        onMouseUp={handleMouseUp}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${supermarket.layout.cols}, minmax(20px, ${SQUARE_SIZE}px))`,
            gridTemplateRows: `repeat(${supermarket.layout.rows}, minmax(20px, ${SQUARE_SIZE}px))`,
          }}
        >
          {supermarket.layout.grid.map((row, rowIndex) =>
            row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                square={square}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
