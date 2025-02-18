import { Button } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import Layout from "./Layout";
import { SquareType } from "../types/square";
import { Layout as LayoutType } from "../types/layout";
import SidebarMenu from "./SidebarMenu";

const ROWS = 20;
const COLS = 30;

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

      {/* Button to toggle Edit Mode */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
      </button>

      {/* Sidebar & Layout Wrapper */}
      <div className="flex items-start gap-4">
        {editMode && (
          <SidebarMenu
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        )}

        <Layout
          layout={layout}
          onSquareClick={handleSquareClick}
          editMode={editMode}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </div>

      <Button onClick={signOut} className="mt-4">
        Sign Out
      </Button>
    </div>
  );
};

export default Dashboard;
