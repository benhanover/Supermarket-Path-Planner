import { Button } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import Layout from "./Layout";
import SidebarMenu from "./SidebarMenu";
import DisplaySquare from "./DisplaySquare";

const DashboardContent = () => {
  const { signOut } = useAuthenticator();
  const { editMode, setEditMode, selectedSquare } = useDashboard();

  return (
    <div className="dashboard flex flex-col items-center p-4">
      <h1>Supermarket Dashboard</h1>
      <p>Manage your supermarket layout here.</p>

      {/* Button to toggle Edit Mode */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {editMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
      </button>

      {/* Sidebar & Layout Wrapper */}
      <div className="flex items-start gap-4">
        {editMode && <SidebarMenu />}
        <Layout />
        {selectedSquare && <DisplaySquare square={selectedSquare} />}{" "}
      </div>

      <Button onClick={signOut} className="mt-4">
        Sign Out
      </Button>
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
