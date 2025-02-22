import { Square as SquareType } from "../types";
import { useDashboard } from "../DashboardContext";

interface SquareProps {
  square: SquareType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}

const Square: React.FC<SquareProps> = ({
  square,
  onMouseDown,
  onMouseEnter,
}) => {
  const { activeAction } = useDashboard();

  const getColor = () => {
    switch (square.type) {
      case "products":
        return "bg-green-500 border-gray-600";
      case "cash_register":
        return "bg-yellow-500 border-green-700";
      case "entrance":
        return "bg-blue-500 border-blue-700";
      case "exit":
        return "bg-red-500 border-red-700";
      default:
        return "bg-gray-200 border-gray-300";
    }
  };

  return (
    <div
      className={`w-full h-full ${getColor()} border rounded-md transition-all 
      ${
        activeAction === "edit_products" && square.type !== "products"
          ? "opacity-30 pointer-events-none"
          : ""
      }
      ${
        activeAction === "edit_products" && square.type === "products"
          ? "hover:scale-115"
          : ""
      }`}
      onMouseDown={() => onMouseDown(square.row, square.col)}
      onMouseEnter={() => {
        onMouseEnter(square.row, square.col);
      }}
    ></div>
  );
};

export default Square;
