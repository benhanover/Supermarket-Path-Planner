import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Explicitly set the user in the AppContext
      setUser(user);
      navigate("/home");
    }
  }, [user, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-500 px-4">
      {/* Full-width Card with Min Width */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl min-w-[560px]">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800 flex items-center justify-center gap-2">
          <span role="img" aria-label="cart">
            🛒
          </span>{" "}
          Supermarket Planner
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Easily design and manage your supermarket layout.
        </p>

        {!user && (
          <div className="flex justify-center w-full">
            <div className="w-full max-w-md">
              <Authenticator className="!w-full" />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <Link to="/about" className="flex flex-col items-center space-y-2">
          <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
            <img src="/assets/shopping-cart.png" alt="Info" className="w-16 h-16" />
          </button>
          <span className="text-xs font-bold text-gray-700">General Info</span>
        </Link>

        <Link to="/goal" className="flex flex-col items-center space-y-2">
          <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
            <img src="/assets/directional-sign.png" alt="Goal" className="w-16 h-16" />
          </button>
          <span className="text-xs font-bold text-gray-700">Our Goal</span>
        </Link>

        <Link to="/docs" className="flex flex-col items-center space-y-2">
          <button className="bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200">
            <img src="/assets/store-map.png" alt="Map" className="w-16 h-16" />
          </button>
          <span className="text-xs font-bold text-gray-700">Store Map</span>
        </Link>
      </div>
    </div>
    
    
  );
}
