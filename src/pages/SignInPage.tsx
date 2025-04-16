import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const SignInPage: React.FC = () => {
  const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
        <h1 className="text-2xl font-bold text-black">
          🛒 Supermarket Path Planner
        </h1>

        <nav className="space-x-8">
          <Link to="/" className="text-black hover:text-cyan-800 font-medium">Home</Link>
          <Link to="/about" className="text-black hover:text-cyan-800 font-medium">About</Link>
          <Link to="/goal" className="text-black hover:text-cyan-800 font-medium">Goal</Link>
          {/* <Link to="/docs" className="text-black hover:text-cyan-800 font-medium">Store Map</Link> */}
          <Link to="/signin" className="ml-4 px-4 py-1 text-black bg-cyan-800 rounded hover:bg-gray-500 transition">Sign In</Link>
        </nav>
      </div>

      <div className="flex items-center justify-center py-2">
        {/* <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <Authenticator />
        </div> */}
        <Authenticator />
      </div>
    </div>
  );
};

export default SignInPage;
