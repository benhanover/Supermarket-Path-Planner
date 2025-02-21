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
          {activeTab === "layout" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-lg"></span>
          )}
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
          {activeTab === "products" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-t-lg"></span>
          )}
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
          {activeTab === "product_square" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-lg"></span>
          )}
        </button>
      </div>

      {/* Editor Sections */}
      <div
        className={`transition-opacity duration-300 ${
          activeTab === "layout" ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <LayoutEditor />
      </div>
      <div
        className={`transition-opacity duration-300 ${
          activeTab === "products" ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <ProductsEditor />
      </div>
      <div
        className={`transition-opacity duration-300 ${
          activeTab === "product_square" ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
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
