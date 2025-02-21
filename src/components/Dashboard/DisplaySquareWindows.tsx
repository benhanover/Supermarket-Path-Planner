import { useDashboard } from "./DashboardContext";
import DisplaySquare from "./DisplaySquare";
import ProductsEditor from "./ProductsEditor";

const DisplaySquareWindow = () => {
  const { selectedSquare } = useDashboard();

  return (
    <div>
      <DisplaySquare />
      <button>Add or Remove Products </button>
      <ProductsEditor />
    </div>
  );
};

export default DisplaySquareWindow;
