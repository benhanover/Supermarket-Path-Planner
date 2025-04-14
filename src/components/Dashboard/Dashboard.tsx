import { useState } from "react";
import { useDashboard } from "./DashboardContext/useDashboard";
import DashboardProvider from "./DashboardContext/DashboardContext";
import Layout from "./Layout/Layout";
import SidebarMenu from "./Layout/SidebarMenu";
import ProductsEditor from "./Products/ProductsEditor";
import ProductSquareEditor from "./Product_Square_Editor/ProductSquareEditor";

const DashboardContent = () => {
  const { activeTab } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden bg-purple-600 text-white p-2 m-2 rounded-md fixed top-16 left-2 z-30"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Responsive Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transform transition-transform duration-300 fixed md:relative z-20 h-full md:h-auto md:flex-shrink-0`}
      >
        <SidebarMenu closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content - white content area */}
      <div className={`flex-1 p-2 md:p-6 bg-white shadow-lg rounded-lg m-2 md:mx-4 md:my-4 overflow-auto transition-all duration-300"
        }`}>
        {activeTab === "layout" && <Layout />}
        {activeTab === "products" && <ProductsEditor mode="global" />}
        {activeTab === "product_square" && <ProductSquareEditor />}
      </div>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
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