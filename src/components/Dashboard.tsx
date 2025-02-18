import React from "react";
import { Button } from "@aws-amplify/ui-react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

const Dashboard = () => {
  const { signOut } = useAuthenticator();

  return (
    <div className="dashboard">
      <h1>Supermarket Dashboard</h1>
      <p>Manage your supermarket layout here.</p>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
