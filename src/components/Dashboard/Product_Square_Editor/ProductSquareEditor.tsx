import { useState } from "react";
import { useDashboard } from "../DashboardContext";
import DisplaySquare from "./DisplaySquare";
import ProductsEditor from "../Products/ProductsEditor";
import { EditableAction } from "../DashboardContext";

const ProductSquareEditor = () => {
  const [showProductsEditor, setShowProductsEditor] = useState(false);
  const { selectedSquare, setEditMode, setActiveTab, setActiveAction } =
    useDashboard();

  if (!selectedSquare)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-semibold text-gray-700 mb-4">
          Please select a product square first
        </h1>
        <button
          onClick={() => {
            setEditMode(true);
            setActiveTab("layout");
            setActiveAction(EditableAction.EditProducts);
          }}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Choose Product Square
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <DisplaySquare />
      <button
        onClick={() => setShowProductsEditor(true)}
        className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
      >
        Add or Remove Products
      </button>
      {showProductsEditor && <ProductsEditor mode="square" />}
    </div>
  );
};

export default ProductSquareEditor;
