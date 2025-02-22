import { DashboardProvider, useDashboard } from "./DashboardContext";
import LayoutEditor from "./LayoutEditor";
import ProductsEditor from "./ProductsEditor";
import DisplaySquareWindow from "./DisplaySquareWindows";

const DashboardContent = () => {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <div className="max-w-5xl w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold transition rounded-t-lg relative 
            ${
              activeTab === "layout"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          onClick={() => setActiveTab("layout")}
        >
          Layout Editor
        </button>
        <button
          className={`px-4 py-2 font-semibold transition rounded-t-lg relative 
            ${
              activeTab === "products"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          onClick={() => setActiveTab("products")}
        >
          Products Editor
        </button>
        <button
          className={`px-4 py-2 font-semibold transition rounded-t-lg relative 
            ${
              activeTab === "product_square"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          onClick={() => setActiveTab("product_square")}
        >
          Product Square Editor
        </button>
      </div>

      {/* Editor Sections */}
      <div className={`${activeTab === "layout" ? "block" : "hidden"}`}>
        <LayoutEditor />
      </div>
      <div className={`${activeTab === "products" ? "block" : "hidden"}`}>
        <ProductsEditor mode="global" />
      </div>
      <div className={`${activeTab === "product_square" ? "block" : "hidden"}`}>
        <DisplaySquareWindow />
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
