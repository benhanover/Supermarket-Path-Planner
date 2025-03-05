import { Link } from "react-router-dom";

const DocsPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-yellow-500 to-red-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Project Documentation</h1>
      <p className="text-lg max-w-2xl text-center">
        Below are the key documents and resources related to the Supermarket Path Planner project.
      </p>
      <ul className="mt-6 list-disc text-lg text-center">
        <li>
          <a href="https://github.com/benhanover/Supermarket-Path-Planner" target="_blank" className="text-blue-300 hover:underline">
            GitHub Repository
          </a>
        </li>
        <li>
          <a href="[Provide-Workshop-Website-Link]" target="_blank" className="text-blue-300 hover:underline">
            Workshop Registration
          </a>
        </li>
      </ul>

      <Link to="/" className="mt-6">
        <button className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300">
          Back to Home
        </button>
      </Link>
    </main>
  );
};

export default DocsPage;
