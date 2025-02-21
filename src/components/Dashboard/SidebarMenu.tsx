import { useDashboard, EditableAction } from "./DashboardContext";
import { SquareType } from "./types";
import { useEffect } from "react";

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
  } = useDashboard();

  // Close active actions when switching to Preview Mode
  useEffect(() => {
    if (!editMode) {
      setActiveAction(EditableAction.None);
    }
  }, [editMode, setActiveAction]);

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
          {/* Modify Layout Button (Hidden when Edit Products is active) */}
          {activeAction !== EditableAction.EditProducts && (
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

          {/* Square Type Selection (Only Show When Modifying Layout) */}
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

          {/* Edit Products Button (Hidden when Modify Layout is active) */}
          {activeAction !== EditableAction.ModifyLayout && (
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
        </>
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
