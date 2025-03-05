import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white">
      <h1 className="text-4xl font-bold mb-4">About Supermarket Path Planner</h1>
      <p className="text-lg max-w-2xl text-center">
        The Supermarket Path Planner is designed to help customers navigate supermarkets efficiently. By generating the shortest route through a store based on the user's grocery list, we save time and reduce frustration.
      </p>
      <p className="mt-4 text-lg max-w-2xl text-center">
        The platform also allows store owners to update store layouts in real-time, ensuring accurate navigation for all customers.
      </p>
      
      <Link to="/" className="mt-6">
        <button className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300">
          Back to Home
        </button>
      </Link>
    </main>
  );
};

export default AboutPage;
