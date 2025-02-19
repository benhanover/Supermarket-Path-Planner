import { Square as SquareType } from "../../types/square";

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
  const getColor = () => {
    switch (square.type) {
      case "aisle":
        return "bg-gray-700";
      case "cash_register":
        return "bg-green-500";
      case "entrance":
        return "bg-blue-500";
      case "exit":
        return "bg-red-500";
      default:
        return "bg-white border border-gray-300";
    }
  };

  return (
    <div
      className={`w-full h-full ${getColor()} cursor-pointer`}
      onMouseDown={() => onMouseDown(square.row, square.col)}
      onMouseEnter={() => onMouseEnter(square.row, square.col)}
    ></div>
  );
};

export default Square;
