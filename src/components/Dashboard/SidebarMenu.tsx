import { useDashboard, EditableAction } from "./DashboardContext";
import { SquareType } from "./types";

const squareTypes: { type: SquareType; color: string; label: string }[] = [
  { type: "empty", color: "bg-gray-200", label: "Empty" },
  { type: "products", color: "bg-green-500", label: "Products" },
  { type: "cash_register", color: "bg-yellow-500", label: "Cash Register" },
  { type: "entrance", color: "bg-blue-500", label: "Entrance" },
  { type: "exit", color: "bg-red-500", label: "Exit" },
];

const SidebarMenu = () => {
  const { selectedType, setSelectedType, activeAction, setActiveAction } =
    useDashboard();

  return (
    <div className="p-4 border-r bg-gray-50 flex flex-col gap-4 w-60">
      {/* Modify Layout Button */}
      <button
        onClick={() =>
          setActiveAction(
            activeAction === EditableAction.ModifyLayout
              ? EditableAction.None
              : EditableAction.ModifyLayout
          )
        }
        className={`p-2 rounded font-bold transition 
          ${
            activeAction === "modify_layout"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } 
          text-white`}
      >
        {activeAction === "modify_layout" ? "Back" : "Modify Layout"}
      </button>

      {/* Square Type Selection (Only Visible When Modifying Layout) */}
      {activeAction === "modify_layout" && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Select Square Type</h2>
          {squareTypes.map(({ type }) => (
            <button
              key={type}
              className={`p-2 border rounded ${
                selectedType === type ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Add Products Button */}
      <button
        onClick={() =>
          setActiveAction(
            activeAction === EditableAction.EditProducts
              ? EditableAction.None
              : EditableAction.EditProducts
          )
        }
        className={`p-2 rounded font-bold transition 
          ${
            activeAction === "edit_products"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } 
          text-white`}
      >
        {activeAction === "edit_products" ? "Back" : "Edit Products"}
      </button>

      {/* Legend Section */}
      <div className="mt-6">
        <h3 className="text-md font-bold">Legend</h3>
        <div className="flex flex-col gap-2 mt-2">
          {squareTypes.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${color} border rounded`}></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
