import Dashboard from "../components/Dashboard/Dashboard";
import { signOut } from "aws-amplify/auth";
import { useAppContext } from "../context/AppContext";
const Home: React.FC = () => {
  const { user } = useAppContext();
  return (
    <div>
      <h1>{user?.supermarketName}</h1>
      <Dashboard />
      <button
        onClick={async () => {
          try {
            await signOut();
            console.log("User logged out successfully");
          } catch (error) {
            console.error("Error signing out:", error);
          }
        }}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
