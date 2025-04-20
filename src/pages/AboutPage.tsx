import { Link } from "react-router-dom";
const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 -z-10"
      />

      <header className="bg-white bg-opacity-70 backdrop-blur-md shadow-md py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            🛒 Supermarket Path Planner
          </h1>
          <nav className="space-x-6">
            <Link to="/" className="text-gray-700 hover:text-purple-800 font-medium transition">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-800 font-medium transition">About</Link>
            <Link to="/goal" className="text-gray-700 hover:text-purple-800 font-medium transition">Goal</Link>
            <Link to="/Docs" className="text-gray-700 hover:text-purple-800 font-medium transition">Docs</Link>
            <Link to="/signin" className="ml-2 px-4 py-1 text-white bg-purple-600 rounded hover:bg-purple-700 transition">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="py-20 px-6 animate-fade-in text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <img
            src="/assets/about.png"
            alt="About Illustration"
            className="w-44 h-44 mb-8 object-contain drop-shadow-xl transition-transform duration-700 ease-in-out hover:scale-105"
          />
          <h2 className="text-5xl font-extrabold text-purple-900 mb-4 tracking-tight animate-fade-up">About Our Tool</h2>
          <p className="text-gray-700 text-2xl font-light leading-relaxed mb-10 animate-fade-up delay-100">
            At Supermarket Path Planner, we believe shopping should feel simple — not like solving a maze🕵️‍♀️.
            Our team is passionate about helping people save time and shop smarter. We’ve built a tool that
            transforms your grocery list into a clear, optimized path through the store 🧾🗺️ No more wandering,
            no more “where was that again?” Just a smooth, guided experience to save your time. 🚀
          </p>

          <section className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-10 shadow-xl w-full max-w-5xl text-left">
            <div className="space-y-10">
              <div className="animate-fade-up delay-150">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Optimizing the Shopping Experience with Cloud Technology</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  In a world where time is one of our most valuable resources, grocery shopping often remains an inefficient and time-consuming task. Our solution, the Supermarket Path Planner, is here to change that.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-200">
                <div>
                  <h4 className="text-xl font-semibold text-purple-700 mb-2">Customer Perspective</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>Struggle to locate items in supermarkets</li>
                    <li>Frequent backtracking and inefficient routes</li>
                    <li>Unclear or outdated store layouts</li>
                    <li>Managing recurring grocery lists manually</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-purple-700 mb-2">Store Owner Perspective</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>Difficulty communicating layout changes</li>
                    <li>Missed opportunities to optimize product placement</li>
                    <li>Lack of visibility into customer shopping behavior</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 animate-fade-up delay-300">
                <p className="text-lg text-gray-800 font-medium">
                  <span className="font-bold text-purple-800">Key Point:</span> Both customers and store owners need a real-time, efficient navigation solution.
                </p>
              </div>

              <div className="mt-10 text-sm text-gray-500 animate-fade-up delay-400">
                <p><span className="font-semibold text-gray-700">Team Members:</span> Guy Sofer, Ben Hanover, Alicia Belhassen</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
