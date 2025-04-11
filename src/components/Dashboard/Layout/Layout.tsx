import { useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useAppContext } from "../../../context/AppContext";
import Square from "./Square";

const SQUARE_SIZE = 24; // Adjust for bigger squares

const Layout = () => {
  const { handleSquareClick } = useDashboard();
  const { supermarket } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);

  if (!supermarket) {
    return <div className="text-center text-gray-500">Loading layout...</div>;
  }

  const handleMouseDown = (row: number, col: number) => {
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

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="p-4 overflow-auto border border-gray-300 shadow-lg rounded-lg bg-white"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${supermarket.layout[0].length}, minmax(20px, ${SQUARE_SIZE}px))`,
            gridTemplateRows: `repeat(${supermarket.layout.length}, minmax(20px, ${SQUARE_SIZE}px))`,
          }}
        >
          {supermarket.layout.map((row, rowIndex) =>
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
