import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const LandingPage: React.FC = () => {
  const { loading } = useAppContext();
  const [showSignIn, setShowSignIn] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);


  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <section className="py-12 px-6 bg-white animate-fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-purple-800 mb-4">About Us</h2>
              <p className="text-gray-600 text-lg mb-6">
                Our platform revolutionizes in-store navigation by providing real-time layout and product positioning tools.
              </p>
              <img src="/assets/about.png" alt="About Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" />
            </div>
          </section>
        );
      case "goal":
        return (
          <section className="py-12 px-6 bg-white animate-fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Our Goal</h2>
              <p className="text-gray-600 text-lg mb-6">
                Helping store owners and managers build better layouts for optimized shopping experiences.
              </p>
              <img src="/assets/goals.png" alt="Goal Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" />
            </div>
          </section>
        );
      case "docs":
        return (
          <section className="py-12 px-6 bg-white animate-fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-purple-800 mb-4">Documentation</h2>
              <p className="text-gray-600 text-lg mb-6">
                Learn how to manage your supermarket layout and update your product catalog in real time.
              </p>
              <img src="/assets/docs.png" alt="Docs Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" />
            </div>
          </section>
        );
      default:
        return (
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
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-puprle-600 to-purple-700 font-sans">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/assets/shopping-cart.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-purple-800">Supermarket Planner</h1>
          </div>
          <nav className="space-x-4">
            <button onClick={() => { setActiveTab("home"); setShowSignIn(false); }} className="text-gray-700 hover:text-purple-700 font-medium">Home</button>
            <button onClick={() => setActiveTab("about")} className="text-gray-700 hover:text-purple-700 font-medium">About</button>
            <button onClick={() => setActiveTab("goal")} className="text-gray-700 hover:text-purple-700 font-medium">Goal</button>
            <button onClick={() => setActiveTab("docs")} className="text-gray-700 hover:text-purple-700 font-medium">Store Map</button>
            <button
              onClick={() => setShowSignIn(true)}
              className="ml-4 px-4 py-1 text-white bg-purple-600 rounded hover:bg-purple-700 transition"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Main Dynamic Content */}
      {renderTabContent()}

      {/* Feature Buttons Section */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-center text-2xl font-bold text-purple-800 mb-8">Learn More</h3>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Supermarket Planner. All rights reserved.
      </footer>

      {/* Embedded Authenticator Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowSignIn(false)}
            >
              ✕
            </button>
            <Authenticator />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
