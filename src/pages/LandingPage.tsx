import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const LandingPage: React.FC = () => {
  const { loading } = useAppContext();
  const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background Blob */}
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
        <h1 className="text-2xl font-bold text-black">
          🛒 Supermarket Path Planner
        </h1>

        <nav className="space-x-8">
          <Link to="/" className="text-black hover:text-cyan-800 font-medium">
            Home
          </Link>
          <Link
            to="/about"
            className="text-black hover:text-cyan-800 font-medium"
          >
            About
          </Link>
          <Link
            to="/goal"
            className="text-black hover:text-cyan-800 font-medium"
          >
            Goal
          </Link>
          {/* <Link
            to="/docs"
            className="text-black hover:text-cyan-800 font-medium"
          >
            Store Map
          </Link> */}
          <Link
            to="/signin"
            className="ml-4 px-4 py-1 text-black bg-cyan-800 rounded hover:bg-gray-500 transition"
          >
            Sign In
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <section className="text-center py-40 px-6 animate-scale-in">
        <h2 className="text-5xl font-bold text-black mb-4">
          Smarter Shopping Starts Here
        </h2>
        <p className="text-2xl text-black max-w-xl mx-auto">
          Optimize your shopping route with ease ✨
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
