import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
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

      <section className="py-12 px-6 animate-fade-in text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-6">🛍️ About Us</h2>

          {/* <p className="text-black text-2xl mb-6">
            Shopping shouldn't feel like a maze!
          </p> */}

          <p className="text-black text-2xl leading-relaxed mb-6">
            At Supermarket Path Planner, we believe shopping should feel simple
            — not like solving a maze🕵️‍♀️. Our team is passionate about helping
            people save time and shop smarter. We’ve built a tool that
            transforms your grocery list into a clear, optimized path through
            the store 🧾🗺️ No more wandering, no more “where was that again?”
            Just a smooth, guided experience that helps you get in, get what you
            need, and get on with your day. 🚀
          </p>

          <p className="text-black text-2xl mb-6">
            It’s shopping — but smarter ✨
          </p>

          {/* <img src="/assets/about.png" alt="About Illustration" className="mx-auto rounded-lg shadow-md max-w-lg" /> */}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
