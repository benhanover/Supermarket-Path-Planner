import { Link } from "react-router-dom";

const GoalPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-500 to-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Our Goal</h1>
      <p className="text-lg max-w-2xl text-center">
        Our mission is to enhance the supermarket shopping experience by minimizing search time and increasing store efficiency.
      </p>
      <p className="mt-4 text-lg max-w-2xl text-center">
        We leverage cloud-based technology, real-time store layout updates, and intelligent pathfinding algorithms to ensure shoppers find what they need quickly and easily.
      </p>
      <p className="mt-4 text-lg max-w-2xl text-center">
        The Supermarket Path Planner is an innovative solution that connects customers and store owners, optimizing both user experience and store management.
      </p>

      <Link to="/" className="mt-6">
        <button className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300">
          Back to Home
        </button>
      </Link>
    </main>
  );
};

export default GoalPage;
