
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Loader from "../components/Loader";

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
      <Loader message="LoadingPage" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-700 font-sans">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/assets/shopping-cart.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-purple-800">Supermarket Planner</h1>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-700 font-medium">About</Link>
            <Link to="/goal" className="text-gray-700 hover:text-purple-700 font-medium">Goal</Link>
            <Link to="/docs" className="text-gray-700 hover:text-purple-700 font-medium">Store Map</Link>
            <Link
              to="/signin"
              className="ml-4 px-4 py-1 text-white bg-purple-600 rounded hover:bg-purple-700 transition"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="text-center py-16 px-6 bg-white animate-fade-in">
        <h2 className="text-4xl font-bold text-purple-700 mb-4">Welcome to Your Smart Store Layout Tool</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Designed for supermarket managers. Streamline your product arrangement,
          optimize customer flow, and visualize your store with ease.
        </p>
        <div className="mt-8">
          <img src="/assets/layout-preview.png" alt="App Preview" className="mx-auto rounded shadow-md max-w-xl" />
        </div>
      </section>

      {/* Feature Buttons Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-center text-2xl font-bold text-purple-800 mb-8">Learn More</h3>
        <div className="flex justify-center space-x-6">
          <Link
            to="/about"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            About Us
          </Link>
          <Link
            to="/goal"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            Our Goals
          </Link>
          <Link
            to="/docs"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            Documentation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Supermarket Planner. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;