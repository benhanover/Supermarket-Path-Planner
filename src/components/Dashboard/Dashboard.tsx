import { useAuthenticator } from "@aws-amplify/ui-react";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import Layout from "./Layout";
import SidebarMenu from "./SidebarMenu";
import DisplaySquare from "./DisplaySquare";

const DashboardContent = () => {
  const { signOut } = useAuthenticator();
  const { editMode, setEditMode, selectedSquare } = useDashboard();

  return (
    <div className="Dashboard max-w-5xl w-full mx-auto flex flex-col p-4">
      <h1 className="text-4xl font-extrabold text-green-800 drop-shadow-md text-center">
        Supermarket Dashboard
      </h1>
      <p className="text-lg text-gray-700 mt-2 text-center">
        Manage your supermarket layout here.
      </p>

      {/* Toggle Edit Mode Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
        </button>
      </div>

      {/* Sidebar & Layout Wrapper */}
      <div className="flex justify-center items-start gap-4 mt-4">
        {editMode && <SidebarMenu />}
        <Layout />
      </div>

      {/* DisplaySquare Below */}
      {selectedSquare && (
        <div className="mt-4 w-full">
          <DisplaySquare />
        </div>
      )}

      {/* Sign Out Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Sign Out
        </button>
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
