import { useDashboard, EditableAction } from "./DashboardContext";
import { SquareType } from "./types";

const squareTypes: SquareType[] = [
  "empty",
  "products",
  "cash_register",
  "entrance",
  "exit",
];

const SidebarMenu = () => {
  const { selectedType, setSelectedType, activeAction, setActiveAction } =
    useDashboard();

  return (
    <div className="p-4 border-r bg-gray-100 min-h-screen flex flex-col gap-4">
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
          {squareTypes.map((type) => (
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
        {activeAction === "edit_products" ? "Back" : "Add Products"}
      </button>
    </div>
  );
};

export default SidebarMenu;
