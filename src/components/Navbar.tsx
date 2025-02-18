import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link> |
      {user ? (
        <button onClick={signOut} style={{ marginLeft: "10px" }}>
          Sign Out
        </button>
      ) : (
        <Link to="/dashboard" style={{ marginLeft: "10px" }}>
          Sign In
        </Link>
      )}
    </nav>
  );
}
