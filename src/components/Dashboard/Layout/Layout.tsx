import { useState } from "react";
import { useDashboard } from "../DashboardContext";
import Square from "./Square";

const SQUARE_SIZE = 24; // Adjust for bigger squares

const Layout = () => {
  const { layout, handleSquareClick, editMode } = useDashboard();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (!editMode) return;
    setIsDragging(true);
    handleSquareClick(row, col, "mouse_down");
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
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
            gridTemplateColumns: `repeat(${layout.cols}, minmax(20px, ${SQUARE_SIZE}px))`,
            gridTemplateRows: `repeat(${layout.rows}, minmax(20px, ${SQUARE_SIZE}px))`,
          }}
        >
          {layout.grid.map((row, rowIndex) =>
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
