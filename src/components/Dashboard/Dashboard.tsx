import { useDashboard } from "./DashboardContext/useDashboard";
import DashboardProvider from "./DashboardContext/DashboardContext";
import LayoutEditor from "./Layout/LayoutEditor";
import ProductsEditor from "./Products/ProductsEditor";
import ProductSquareEditor from "./Product_Square_Editor/ProductSquareEditor";

const DashboardContent = () => {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <div className="flex h-screen min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-gray-900 text-white p-4 space-y-4">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-800 ${
            activeTab === "layout" ? "bg-blue-600" : ""
          }`}
          onClick={() => setActiveTab("layout")}
        >
          Layout Editor
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-800 ${
            activeTab === "products" ? "bg-green-600" : ""
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products Editor
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-800 ${
            activeTab === "product_square" ? "bg-purple-600" : ""
          }`}
          onClick={() => setActiveTab("product_square")}
        >
          Product Square Editor
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-xl ml-4 my-4">
        {activeTab === "layout" && <LayoutEditor />}
        {activeTab === "products" && <ProductsEditor mode="global" />}
        {activeTab === "product_square" && <ProductSquareEditor />}
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
