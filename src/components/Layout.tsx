import { SquareType, Layout as LayoutType } from "../types";
import Square from "./Square"; // Ensure Square component is correctly imported
import { useState } from "react";

const SQUARE_SIZE = 24; // Adjust for bigger squares

interface LayoutProps {
  layout: LayoutType;
  onSquareClick: (row: number, col: number) => void;
  editMode: boolean;
  selectedType: SquareType;
  setSelectedType: (type: SquareType) => void;
}

const Layout: React.FC<LayoutProps> = ({ layout, onSquareClick, editMode }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (!editMode) return;
    setIsDragging(true);
    onSquareClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      onSquareClick(row, col);
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
