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
      <div className="w-56 bg-gray-200 text-purple p-4 space-y-4">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-purple-200 ${
            activeTab === "layout" ? "bg-purple-200" : ""
          }`}
          onClick={() => setActiveTab("layout")}
        >
          Layout Editor
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-purple-200 ${
            activeTab === "products" ? "bg-purple-200" : ""
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products Editor
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition hover:bg-purple-200 ${
            activeTab === "product_square" ? "bg-purple-200" : ""
          }`}
          onClick={() => setActiveTab("product_square")}
        >
          Product Square Editor
        </button>
      </div>

      {/* Main Content */}
      <div className="w-370 p-6 bg-white shadow-lg rounded-xl ml-4 my-4">
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
