import { useState } from "react";
import { useDashboard } from "./DashboardContext";
import Square from "./Square"; // Ensure Square component is correctly imported

const SQUARE_SIZE = 24; // Adjust for bigger squares

const Layout = () => {
  const { layout, handleSquareClick, editMode } = useDashboard();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (!editMode) return;
    setIsDragging(true);
    handleSquareClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      handleSquareClick(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex" onMouseUp={handleMouseUp}>
      <div className="flex flex-col items-center p-4 overflow-auto">
        <div
          className="grid gap-0.5 border border-gray-400"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, ${SQUARE_SIZE}px)`,
            gridTemplateRows: `repeat(${layout.rows}, ${SQUARE_SIZE}px)`,
            width: `${layout.cols * SQUARE_SIZE}px`,
            height: `${layout.rows * SQUARE_SIZE}px`,
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
