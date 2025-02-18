// import { Button } from "@aws-amplify/ui-react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import { useState } from "react";
// import Layout from "./Layout";
// import { Square, Layout as LayoutType } from "../types";

// const Dashboard = () => {
//   const { signOut } = useAuthenticator();

//   const handleSquareClick = (row: number, col: number) => {
//     setLayout((prevLayout) => {
//       const newLayout = prevLayout.map((r, rowIndex) =>
//         r.map((square, colIndex) => {
//           if (rowIndex === row && colIndex === col) {
//             return new Square(
//               square.type === "empty" ? "aisle" : "empty",
//               [],
//               row,
//               col
//             );
//           }
//           return square;
//         })
//       );
//       return newLayout;
//     });
//   };

//   return (
//     <div className="dashboard">
//       <h1>Supermarket Dashboard</h1>
//       <p>Manage your supermarket layout here.</p>
//       {/* <Layout layout={layout} onSquareClick={handleSquareClick} /> */}
//       <Button onClick={signOut}>Sign Out</Button>
//     </div>
//   );
// };

// export default Dashboard;
import { Button } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import Layout from "./Layout";
import { SquareType } from "../types/square";
import { Layout as LayoutType } from "../types/layout";

const ROWS = 20;
const COLS = 30;
const SQUARE_SIZE = 24; // Adjust square size here

const createInitialLayout = (): LayoutType => ({
  rows: ROWS,
  cols: COLS,
  grid: Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      type: "empty",
      products: [],
      row,
      col,
    }))
  ),
});

const Dashboard = () => {
  const { signOut } = useAuthenticator();
  const [layout, setLayout] = useState<LayoutType>(createInitialLayout);
  const [selectedType, setSelectedType] = useState<SquareType>("empty");
  const [editMode, setEditMode] = useState(true);

  const handleSquareClick = (row: number, col: number) => {
    setLayout((prevLayout) => {
      const newGrid = prevLayout.grid.map((r) =>
        r.map((square) =>
          square.row === row && square.col === col
            ? { ...square, type: selectedType }
            : square
        )
      );
      return { ...prevLayout, grid: newGrid };
    });
  };

  return (
    <div className="dashboard flex flex-col items-center p-4">
      <h1>Supermarket Dashboard</h1>
      <p>Manage your supermarket layout here.</p>

      <button
        onClick={() => setEditMode(!editMode)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
      </button>

      <Layout
        layout={layout}
        onSquareClick={handleSquareClick}
        editMode={editMode}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
