import { DashboardProvider, useDashboard } from "./DashboardContext";
import LayoutEditor from "./LayoutEditor";
import DisplaySquare from "./DisplaySquare";

const DashboardContent = () => {
  const { selectedSquare } = useDashboard();

  return (
    <div className="Dashboard max-w-5xl w-full mx-auto flex flex-col p-4">
      <h1 className="text-4xl font-extrabold text-green-800 drop-shadow-md text-center">
        Supermarket Dashboard
      </h1>
      <p className="text-lg text-gray-700 mt-2 text-center">
        Manage your supermarket layout here.
      </p>

      {/* Sidebar & Layout Wrapper */}
      <LayoutEditor />

      {/* DisplaySquare Below */}
      {selectedSquare && (
        <div className="mt-4 w-full">
          <DisplaySquare />
        </div>
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
