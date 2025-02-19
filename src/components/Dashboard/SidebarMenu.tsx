import { useDashboard } from "./DashboardContext";
import { SquareType } from "../../types/square";

const squareTypes: SquareType[] = [
  "empty",
  "aisle",
  "cash_register",
  "entrance",
  "exit",
];

const SidebarMenu = () => {
  const { selectedType, setSelectedType } = useDashboard();

  return (
    <div className="p-4 border-r bg-gray-100 min-h-screen">
      <h2 className="text-lg font-bold mb-4">Select Square Type</h2>
      <div className="flex flex-col gap-2">
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
    </div>
  );
};

export default SidebarMenu;
