import { useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import { EditableAction } from "../types";
import DisplaySquare from "./DisplaySquare";
import ProductsEditor from "../Products/ProductsEditor";

const ProductSquareEditor = () => {
  const [showProductsEditor, setShowProductsEditor] = useState(false);
  const { selectedSquare, setActiveTab, setActiveAction } =
    useDashboard();

  if (!selectedSquare)
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h1 className="text-base md:text-xl font-semibold text-gray-700 mb-3 md:mb-4 text-center">
          Please select a product square first
        </h1>
        <button
          onClick={() => {
            setActiveTab("layout");
            setActiveAction(EditableAction.EditProducts);
          }}
          className="px-3 md:px-5 py-1 md:py-2 bg-blue-600 text-white text-sm md:text-base font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Choose Product Square
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 p-2 md:p-6 overflow-auto">
      <DisplaySquare />
      <button
        onClick={() => setShowProductsEditor(!showProductsEditor)}
        className="px-3 md:px-5 py-1 md:py-2 bg-green-600 text-white text-sm md:text-base font-medium rounded-lg shadow-md hover:bg-green-700 transition"
      >
        {showProductsEditor ? "Hide Products" : "Add or Remove Products"}
      </button>
      {showProductsEditor && <ProductsEditor mode="square" />}
    </div>
  );
};

export default ProductSquareEditor;