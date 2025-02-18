import React from "react";
import { SquareType } from "../types/square";

type SidebarMenuProps = {
  selectedType: SquareType;
  onSelectType: (type: SquareType) => void;
};

const squareTypes: SquareType[] = [
  "empty",
  "aisle",
  "cash_register",
  "entrance",
  "exit",
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  selectedType,
  onSelectType,
}) => {
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
            onClick={() => onSelectType(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
