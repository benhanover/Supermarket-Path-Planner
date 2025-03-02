import { useAppContext } from "../../../context/AppContext";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";
import { SquareType } from "../types";
import { useEffect, useState } from "react";
import productsData from "../../../mocks/products.json";

// Square types with colors for UI
const squareTypes: { type: SquareType; color: string; label: string }[] = [
  { type: "empty", color: "bg-gray-300", label: "Empty" },
  { type: "products", color: "bg-green-400", label: "Products" },
  { type: "cash_register", color: "bg-yellow-400", label: "Cash Register" },
  { type: "entrance", color: "bg-blue-400", label: "Entrance" },
  { type: "exit", color: "bg-red-400", label: "Exit" },
];

const SidebarMenu = () => {
  const {
    selectedType,
    setSelectedType,
    activeAction,
    setActiveAction,
    editMode,
    setEditMode,
    saveLayout,
    addProduct,
  } = useDashboard();
  const { setSupermarket, supermarket, handleError } = useAppContext();

  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [newRows, setNewRows] = useState<number | "">();
  const [newCols, setNewCols] = useState<number | "">();
  const [isPopulatingProducts, setIsPopulatingProducts] = useState(false);

  // Close active actions when switching to Preview Mode
  useEffect(() => {
    if (!editMode) {
      setActiveAction(EditableAction.None);
    }
  }, [editMode, setActiveAction]);

  // Function to populate products
  const handlePopulateProducts = async () => {
    if (!supermarket) {
      handleError(new Error("No supermarket found"), "Populate Products");
      return;
    }

    // Confirm before populating
    const confirmPopulate = window.confirm(
      "Are you sure you want to populate products? This will add all 50 products to your supermarket."
    );

    if (!confirmPopulate) return;

    try {
      setIsPopulatingProducts(true);

      // Add products one by one
      for (const product of productsData.products) {
        await addProduct(product);
      }

      alert(`Successfully added ${productsData.products.length} products!`);
    } catch (error) {
      console.error("Error populating products:", error);
      handleError(error, "Populate Products");
    } finally {
      setIsPopulatingProducts(false);
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
          productIds: [], // Make sure you're using productIds, not products
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
    <div
      className={`p-6 border-r flex flex-col gap-4 w-64 transition-all duration-300
        rounded-xl shadow-lg
        ${editMode ? "bg-gray-800 text-white" : "bg-gray-100"}`}
    >
      {/* Toggle Edit Mode */}
      <button
        onClick={() => setEditMode(!editMode)}
        className={`p-3 rounded-lg font-semibold transition w-full
          ${
            editMode
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
      </button>

      {/* Hide buttons when in Preview Mode */}
      {editMode && (
        <>
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
                className={`p-3 rounded-lg font-semibold transition w-full
                ${
                  activeAction === EditableAction.ModifyLayout
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
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
              <h2 className="text-lg font-bold">Select Square Type</h2>
              {squareTypes.map(({ type, color }) => (
                <button
                  key={type}
                  className={`p-2 border rounded-lg transition w-full ${color} text-black hover:opacity-75
                    ${selectedType === type ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Edit Products Button */}
          {activeAction !== EditableAction.ModifyLayout &&
            activeAction !== EditableAction.ChangeLayoutSize && (
              <button
                onClick={() =>
                  setActiveAction(
                    activeAction === EditableAction.EditProducts
                      ? EditableAction.None
                      : EditableAction.EditProducts
                  )
                }
                className={`p-3 rounded-lg font-semibold transition w-full
                ${
                  activeAction === EditableAction.EditProducts
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
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
                className={`p-3 rounded-lg font-semibold transition w-full
                ${
                  activeAction === EditableAction.ChangeLayoutSize
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                {activeAction === EditableAction.ChangeLayoutSize
                  ? "Cancel Layout Change"
                  : "Change Layout Size"}
              </button>
            )}

          {/* Populate Products Button */}
          <button
            onClick={handlePopulateProducts}
            disabled={isPopulatingProducts}
            className={`p-3 rounded-lg font-semibold transition w-full
              ${
                isPopulatingProducts
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {isPopulatingProducts ? "Populating..." : "Populate Products"}
          </button>
        </>
      )}

      {/* Layout Size Input Prompt */}
      {showSizePrompt && activeAction === EditableAction.ChangeLayoutSize && (
        <div className="p-4 border rounded-lg bg-gray-200 text-black mt-4">
          <h3 className="text-md font-bold">Enter New Layout Size</h3>
          <input
            type="number"
            placeholder="Rows"
            className="w-full p-2 mt-2 border rounded"
            value={newRows}
            onChange={(e) => setNewRows(Number(e.target.value) || "")}
          />
          <input
            type="number"
            placeholder="Columns"
            className="w-full p-2 mt-2 border rounded"
            value={newCols}
            onChange={(e) => setNewCols(Number(e.target.value) || "")}
          />
          <button
            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={confirmLayoutSize}
          >
            Confirm
          </button>
        </div>
      )}

      {/* Legend Section */}
      <div className="mt-6">
        <h3 className="text-md font-bold">Legend</h3>
        <div className="flex flex-col gap-2 mt-2">
          {squareTypes.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${color} border rounded-md`}></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
