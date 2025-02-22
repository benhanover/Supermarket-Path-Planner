import Dashboard from "../components/Dashboard/Dashboard";
import React, { useEffect } from "react";
import { signOut, fetchUserAttributes } from "aws-amplify/auth";

const Home: React.FC = () => {
  useEffect(() => {
    async function getUserAttributes() {
      try {
        const attributes = await fetchUserAttributes();
        console.log("User attributes: ", attributes);
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    }
    getUserAttributes();
  }, []);

  return (
    <div>
      <h1>HOME</h1>
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
