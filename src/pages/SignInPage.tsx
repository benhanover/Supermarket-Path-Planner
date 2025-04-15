// src/pages/SignInPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const SignInPage: React.FC = () => {
  const { setUser, loading } = useAppContext();
  const { user } = useAuthenticator();
  const navigate = useNavigate();



  useEffect(() => {
    if (user) {
      setUser(user)
      navigate("/home");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <Loader message="SignInPage" />
    )
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
          </nav>
        </div>
      </header>

      {/* Sign In Content */}
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Authenticator />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Supermarket Planner. All rights reserved.
      </footer>
    </div>
  );
};

export default SignInPage;