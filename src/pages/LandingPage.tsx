// import { useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAppContext } from "../context/AppContext";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";

// const LandingPage: React.FC = () => {
//   const { loading } = useAppContext();
//   const { user } = useAuthenticator();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate("/home");
//     }
//   }, [user, navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen font-sans overflow-hidden">
//       {/* Background Blob */}
//       <img
//         src="/bg-blue.svg"
//         alt="background blob"
//         className="absolute top-0 left-0 w-full h-full object-cover -z-10"
//       />

//       {/* Navigation Header */}
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
//         <h1 className="text-2xl font-bold text-black">
//           🛒 Supermarket Path Planner
//         </h1>

//         <nav className="space-x-8">
//           <Link to="/" className="text-black hover:text-cyan-800 font-medium">
//             Home
//           </Link>
//           <Link
//             to="/about"
//             className="text-black hover:text-cyan-800 font-medium"
//           >
//             About
//           </Link>
//           <Link
//             to="/goal"
//             className="text-black hover:text-cyan-800 font-medium"
//           >
//             Goal
//           </Link>
//           { <Link
//             to="/docs"
//             className="text-black hover:text-cyan-800 font-medium"
//           >
//             Docs
//           </Link> }
//           <Link
//             to="/signin"
//             className="ml-4 px-4 py-1 text-black bg-cyan-700 rounded hover:bg-cyan-800 transition"
//           >
//             Sign In
//           </Link>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <section className="text-center py-40 px-6 animate-scale-in">
//         <h2 className="text-5xl font-bold text-black mb-4">
//           Smarter Shopping Starts Here
//         </h2>
//         <p className="text-2xl text-black max-w-xl mx-auto">
//           Optimize your shopping route with ease ✨
//         </p>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans overflow-hidden bg-white">
      {/* Background Blob */}
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          🛒 Supermarket Path Planner
        </h1>

        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">About</Link>
          <Link to="/goal" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Goal</Link>
          <Link to="/docs" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Docs</Link>
          <Link
            to="/signin"
            className="ml-4 px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <section className="text-center pt-16 pb-8 px-6 animate-scale-in">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 animate-fade-up">
          Smarter Shopping Starts Here
        </h2>
        <p className="text-2xl text-gray-800 max-w-xl mx-auto animate-fade-up delay-100">
          Optimize your shopping route with ease ✨
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3 animate-fade-up delay-200">
          Discover a new way to navigate your grocery list — faster paths, fewer missed items, and a smoother store experience.
        </p>

        <div className="mt-8 animate-fade-up delay-300">
          <Link
            to="/signin"
            className="inline-block px-8 py-3 bg-purple-700 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-purple-800 transition-transform transform hover:scale-105"
          >
            Get Started →
          </Link>
        </div>
      </section>

      {/* Lower Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-10 md:gap-12">
        <div className="md:w-1/2 text-left animate-fade-up delay-500">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
            Efficient Supermarket Management
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Manage your store layout and optimize shopping routes with our powerful, real-time system.
          </p>
        </div>
        <div className="md:w-1/2 animate-fade-up delay-600">
          <img
            src="/assets/landingpic.png"
            alt="Store Layout Preview"
            className="rounded-xl shadow-lg w-full max-w-sm mx-auto"
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
