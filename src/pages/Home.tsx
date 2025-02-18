import Dashboard from "../components/Dashboard";
import { useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

const Home = () => {
  useEffect(() => {
    async function getUserAttributes() {
      try {
        const attributes = await fetchUserAttributes();
        console.log("attributes: ", attributes);
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
    </div>
  );
};

export default Home;
