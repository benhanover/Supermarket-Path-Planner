// import { useState, useEffect } from "react";
// import { useDashboard } from "../DashboardContext/useDashboard";
// import Square from "./Square";

// const SQUARE_SIZE = 24; // Adjust for bigger squares

// const Layout = () => {
//   const { supermarket, handleSquareClick, editMode, activeAction } =
//     useDashboard();
//   const [isDragging, setIsDragging] = useState(false);

//   // Log when layout props change
//   useEffect(() => {
//     console.log("Layout component rendered");
//     console.log(`Edit mode: ${editMode}, Active action: ${activeAction}`);

//     if (supermarket) {
//       console.log(
//         `Layout dimensions: ${supermarket.layout.length}x${supermarket.layout[0].length}`
//       );
//     }
//   }, [supermarket, editMode, activeAction]);

//   if (!supermarket) {
//     return <div className="text-center text-gray-500">Loading layout...</div>;
//   }

//   const handleMouseDown = (row: number, col: number) => {
//     console.log(`Layout: Mouse down at (${row},${col}), editMode: ${editMode}`);
//     if (!editMode) return;

//     setIsDragging(true);
//     handleSquareClick(row, col, "mouse_down");
//   };

//   const handleMouseEnter = (row: number, col: number) => {
//     if (isDragging) {
//       console.log(`Layout: Mouse enter at (${row},${col}) while dragging`);
//       handleSquareClick(row, col, "mouse_enter");
//     }
//   };

//   const handleMouseUp = () => {
//     console.log("Layout: Mouse up, stopping drag");
//     setIsDragging(false);
//   };

//   const handleMouseLeave = () => {
//     console.log("Layout: Mouse left the layout area, stopping drag");
//     setIsDragging(false);
//   };

//   return (
//     <div className="flex justify-center items-center w-full h-full overflow-hidden">
//       <div
//         className="p-4 overflow-auto border border-gray-300 shadow-lg rounded-lg bg-white relative"
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* Overlay only appears when in Edit Mode, but is invisible */}
//         {!editMode && (
//           <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10 pointer-events-none">
//             <div className="p-4 bg-white rounded-lg shadow-md opacity-0">
//               <p className="text-gray-700">Preview Mode</p>
//             </div>
//           </div>
//         )}

//         <div
//           className="grid gap-0.5"
//           style={{
//             gridTemplateColumns: `repeat(${supermarket.layout[0].length}, minmax(20px, ${SQUARE_SIZE}px))`,
//             gridTemplateRows: `repeat(${supermarket.layout.length}, minmax(20px, ${SQUARE_SIZE}px))`,
//           }}
//         >
//           {supermarket.layout.map((row, rowIndex) =>
//             row.map((square, colIndex) => (
//               <Square
//                 key={`${rowIndex}-${colIndex}`}
//                 square={square}
//                 onMouseDown={handleMouseDown}
//                 onMouseEnter={handleMouseEnter}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;
import { useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import Square from "./Square";

const SQUARE_SIZE = 24; // Adjust for bigger squares

const Layout = () => {
  const { supermarket, handleSquareClick, editMode, activeAction } =
    useDashboard();
  const [isDragging, setIsDragging] = useState(false);

  if (!supermarket) {
    return <div className="text-center text-gray-500">Loading layout...</div>;
  }

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

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden">
      <div
        className="p-4 overflow-auto border border-gray-300 shadow-lg rounded-lg bg-white relative"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Overlay only appears when in Edit Mode, but is invisible */}
        {!editMode && (
          <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10 pointer-events-none">
            <div className="p-4 bg-white rounded-lg shadow-md opacity-0">
              <p className="text-gray-700">Preview Mode</p>
            </div>
          </div>
        )}

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
