
import { useState, useEffect } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useAppContext } from "../../../context/AppContext";
import Square from "./Square";

const Layout = () => {
  const { handleSquareClick } = useDashboard();
  const { supermarket } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [squareSize, setSquareSize] = useState(24); // Default size

  // Adjust square size based on screen width
  useEffect(() => {
    const adjustSquareSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSquareSize(16); // mobile
      } else if (width < 768) {
        setSquareSize(20); // tablets
      } else {
        setSquareSize(24); // default
      }
    };

    adjustSquareSize();
    window.addEventListener("resize", adjustSquareSize);
    return () => window.removeEventListener("resize", adjustSquareSize);
  }, []);

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

  const handleTouchStart = (row: number, col: number) => {
    handleSquareClick(row, col, "mouse_down");
  };

  return (
    <div className="flex justify-center items-center w-full h-full overflow-auto">
      <div
        className="p-2 md:p-4 overflow-auto border border-gray-300 shadow-lg rounded-lg bg-white max-w-full max-h-[80vh]"
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        // 🟢 לא נשתמש ב־onMouseLeave כדי לא לאפס את הבחירה כשעוברים עם העכבר
      >
        <div
          className="grid gap-px md:gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${supermarket.layout[0].length}, minmax(${squareSize / 2}px, ${squareSize}px))`,
            gridTemplateRows: `repeat(${supermarket.layout.length}, minmax(${squareSize / 2}px, ${squareSize}px))`,
          }}
        >
          {supermarket.layout.map((row, rowIndex) =>
            row.map((square, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                square={square}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
