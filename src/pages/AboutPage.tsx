// src/pages/AboutPage.tsx
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
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

      {/* About Content */}
      <section className="py-12 px-6 bg-white animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">About Us</h2>
          <p className="text-gray-600 text-lg mb-6">
            Our platform revolutionizes in-store navigation by providing real-time layout and product positioning tools.
          </p>
          <img src="/assets/about.png" alt="About Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Supermarket Planner. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;