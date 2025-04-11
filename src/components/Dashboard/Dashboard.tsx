import { useDashboard } from "./DashboardContext/useDashboard";
import DashboardProvider from "./DashboardContext/DashboardContext";
import Layout from "./Layout/Layout";
import SidebarMenu from "./Layout/SidebarMenu";
import ProductsEditor from "./Products/ProductsEditor";
import ProductSquareEditor from "./Product_Square_Editor/ProductSquareEditor";

const DashboardContent = () => {
  const { activeTab } = useDashboard();

  return (
    <div className="flex h-screen min-h-screen">
      {/* Unified Sidebar Navigation - now outside the white content area */}
      <SidebarMenu />

      {/* Main Content - white content area without the sidebar */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-xl mx-4 my-4">
        {activeTab === "layout" && <Layout />}
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