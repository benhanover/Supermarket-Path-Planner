import { Link } from "react-router-dom";

const DocsPage: React.FC = () => {
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
          <Link to="/docs" className="text-black hover:text-cyan-800 font-medium">Store Map</Link>
          <Link to="/signin" className="ml-4 px-4 py-1 text-black bg-cyan-800 rounded hover:bg-gray-500 transition">Sign In</Link>
        </nav>
      </div>

      <section className="py-12 px-6 animate-fade-in text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-4">Documentation</h2>
          <p className="text-black text-lg mb-6">
            Learn how to manage your supermarket layout and update your product catalog in real time.
          </p>
          {/* <img src="/assets/docs.png" alt="Docs Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" /> */}
        </div>
      </section>
    </div>
  );
};

export default DocsPage;
