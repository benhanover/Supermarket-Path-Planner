import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { NavBar } from "../components/Navbar";

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
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      {/* Background */}
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 -z-10"
      />

      <NavBar />

      <main className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 animate-scale-in">
            Smarter Shopping Starts Here
          </h2>
          <p className="text-2xl text-gray-800 max-w-xl mx-auto animate-scale-in">
            Optimize your shopping route with ease ✨
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3 animate-scale-in">
            Discover a new way to navigate your grocery list — faster paths, fewer missed items, and a smoother store experience.
          </p>

          <div className="mt-8 animate-scale-in">
            <Link
              to="/signin"
              className="inline-block px-8 py-3 bg-[#5B8DB8] text-white text-lg font-medium rounded-lg shadow-lg hover:bg-[#5B8DB8] transition-transform transform hover:scale-105"
            >
              Get Started →
            </Link>
          </div>
        </div>

        {/* Lower Section */}
        <section className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-10 shadow-xl w-full max-w-5xl mx-auto mt-16 text-left">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
            <div className="md:w-1/2 ">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                Efficient Supermarket Management
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Manage your store layout and optimize shopping routes with our powerful, real-time system.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="public/assets/ladywithcart.png"
                alt="Store Layout Preview"
                className="rounded-xl w-full max-w-sm mx-auto"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
