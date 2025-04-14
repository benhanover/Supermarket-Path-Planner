import { useAppContext } from "../../../context/AppContext";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";
import { SquareType } from "../types";
import { useState } from "react";

// Square types with colors for UI
const squareTypes: { type: SquareType; color: string; label: string }[] = [
  { type: "empty", color: "bg-gray-300", label: "Empty" },
  { type: "products", color: "bg-green-500", label: "Products" },
  { type: "cash_register", color: "bg-yellow-500", label: "Cash Register" },
  { type: "entrance", color: "bg-blue-600", label: "Entrance" },
  { type: "exit", color: "bg-red-600", label: "Exit" },
];

interface SidebarMenuProps {
  closeSidebar?: () => void;
}

const SidebarMenu = ({ closeSidebar }: SidebarMenuProps) => {
  const {
    selectedType,
    setSelectedType,
    activeAction,
    setActiveAction,
    setSelectedSquare,
    saveLayout,
    activeTab,
    setActiveTab
  } = useDashboard();
  const { setSupermarket } = useAppContext();

  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [newRows, setNewRows] = useState<number | "">();
  const [newCols, setNewCols] = useState<number | "">();

  // Handle tab change with optional sidebar closing for mobile
  const handleTabChange = (tab: "layout" | "products" | "product_square") => {
    setActiveTab(tab);
    if (closeSidebar) {
      closeSidebar();
    }
  };

  // Function to confirm new layout size
  const confirmLayoutSize = async () => {
    if (!newRows || !newCols) {
      alert("Please enter valid numbers for rows and columns.");
      return;
    }

    const confirmChange = window.confirm(
      `Are you sure you want to reset the layout to ${newRows} rows and ${newCols} columns? This will erase all current data.`
    );

    if (!confirmChange) return;

    try {
      console.log("Updating layout size to Rows:", newRows, "Cols:", newCols);

      // Create the new layout
      const newLayout = Array.from({ length: Number(newRows) }, (_, row) =>
        Array.from({ length: Number(newCols) }, (_, col) => ({
          type: "empty" as const,
          productIds: [],
          row,
          col,
        }))
      );

      // Update supermarket state in AppContext
      setSupermarket((prevSupermarket) => {
        if (!prevSupermarket) return null;

        return {
          ...prevSupermarket,
          layout: newLayout,
        };
      });

      // Save the layout to the database
      await saveLayout(newLayout);

      setShowSizePrompt(false);
      setActiveAction(EditableAction.None);
    } catch (error) {
      console.error("Failed to update layout size:", error);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-gray-200 p-4 md:p-6 flex flex-col gap-3 shadow-lg overflow-y-auto">
      {/* Editor Selection Tabs */}
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Dashboard</h2>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-purple-200 text-sm md:text-base ${activeTab === "layout" ? "bg-purple-200" : ""
            }`}
          onClick={() => handleTabChange("layout")}
        >
          🎨 Layout Editor
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-purple-200 text-sm md:text-base ${activeTab === "products" ? "bg-purple-200" : ""
            }`}
          onClick={() => handleTabChange("products")}
        >
          🛠 Products Editor
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition hover:bg-purple-200 text-sm md:text-base ${activeTab === "product_square" ? "bg-purple-200" : ""
            }`}
          onClick={() => handleTabChange("product_square")}
        >
          🔍 Product Square Editor
        </button>
      </div>

      {/* Show Layout Controls only when Layout tab is active */}
      {activeTab === "layout" && (
        <>
          <h2 className="text-lg font-bold text-gray-700">Layout Controls</h2>

          {/* Modify Layout Button */}
          {activeAction !== EditableAction.EditProducts &&
            activeAction !== EditableAction.ChangeLayoutSize && (
              <button
                onClick={() =>
                  setActiveAction(
                    activeAction === EditableAction.ModifyLayout
                      ? EditableAction.None
                      : EditableAction.ModifyLayout
                  )
                }
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.ModifyLayout
                    ? "bg-purple-200 hover:bg-purple-200 text-black"
                    : "bg-gray-400 hover:bg-purple-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.ModifyLayout
                  ? "Cancel Layout Edit"
                  : "Modify Layout"}
              </button>
            )}

          {/* Square Type Selection */}
          {activeAction === EditableAction.ModifyLayout && (
            <div className="flex flex-col gap-2">
              <h2 className="text-base md:text-lg font-semibold text-black">
                Select Square Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
                {squareTypes.map(({ type, color }) => (
                  <button
                    key={type}
                    className={`p-1 md:p-2 border rounded-lg transition w-full ${color} text-black hover:opacity-75 text-xs md:text-sm
                        ${selectedType === type ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edit Products Button */}
          {activeAction !== EditableAction.ModifyLayout &&
            activeAction !== EditableAction.ChangeLayoutSize && (
              <button
                onClick={() => {
                  if (activeAction === EditableAction.EditProducts) {
                    setActiveAction(EditableAction.None);
                    setSelectedSquare(null);
                  } else {
                    setActiveAction(EditableAction.EditProducts);
                  }
                }}
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.EditProducts
                    ? "bg-purple-200 hover:bg-purple-200 text-black"
                    : "bg-gray-400 hover:bg-purple-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.EditProducts
                  ? "Cancel Product Edit"
                  : "Edit Products"}
              </button>
            )}

          {/* Change Layout Size Button */}
          {activeAction !== EditableAction.ModifyLayout &&
            activeAction !== EditableAction.EditProducts && (
              <button
                onClick={() => {
                  setActiveAction(
                    activeAction === EditableAction.ChangeLayoutSize
                      ? EditableAction.None
                      : EditableAction.ChangeLayoutSize
                  );
                  setShowSizePrompt(true);
                }}
                className={`p-2 md:p-3 rounded-lg font-semibold transition w-full text-sm md:text-base
                  ${activeAction === EditableAction.ChangeLayoutSize
                    ? "bg-purple-200 hover:bg-purple-200 text-black"
                    : "bg-gray-400 hover:bg-purple-200 text-black"
                  }`}
              >
                {activeAction === EditableAction.ChangeLayoutSize
                  ? "Cancel Layout Change"
                  : "Change Layout Size"}
              </button>
            )}

          {/* Layout Size Input Prompt */}
          {showSizePrompt && activeAction === EditableAction.ChangeLayoutSize && (
            <div className="p-3 md:p-4 border rounded-lg bg-gray-200 text-black mt-2 md:mt-4">
              <h3 className="text-sm md:text-md font-bold">Enter New Layout Size</h3>
              <input
                type="number"
                placeholder="Rows"
                className="w-full p-2 mt-2 border rounded text-sm"
                value={newRows ?? ""}
                onChange={(e) => setNewRows(Number(e.target.value) || "")}
              />
              <input
                type="number"
                placeholder="Columns"
                className="w-full p-2 mt-2 border rounded text-sm"
                value={newCols ?? ""}
                onChange={(e) => setNewCols(Number(e.target.value) || "")}
              />
              <button
                className="mt-2 md:mt-3 px-3 md:px-4 py-1 md:py-2 bg-blue-200 text-black rounded-lg hover:bg-blue-300 text-sm"
                onClick={confirmLayoutSize}
              >
                Confirm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SidebarMenu;