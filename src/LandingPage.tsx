import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Supermarket Planner</h1>
      <p className="text-lg text-gray-200 mb-6 text-center max-w-lg">
        Easily design and manage your supermarket layout.
      </p>

      
      <div className="mt-8 flex justify-center gap-6 text-white">
        <div className="flex flex-col items-center">
          <Link to="/about">
            <button
              className="bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 flex items-center justify-center"
              style={{ width: "90px", height: "90px", padding: "5px" }}
            >
              <img
                src="/assets/shopping-cart.png"
                alt="Info"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </button>
          </Link>
          <span className="text-sm font-bold text-white mt-2">General Info</span>
        </div>

        <div className="flex flex-col items-center">
          <Link to="/goal">
            <button
              className="bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 flex items-center justify-center"
              style={{ width: "90px", height: "90px", padding: "5px" }}
            >
              <img
                src="/assets/directional-sign.png"
                alt="Goal"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </button>
          </Link>
          <span className="text-sm font-bold text-white mt-2">Our Goal</span>
        </div>

        <div className="flex flex-col items-center">
          <Link to="/docs">
            <button
              className="bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 flex items-center justify-center"
              style={{ width: "90px", height: "90px", padding: "5px" }}
            >
              <img
                src="/assets/store-map.png"
                alt="Map"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </button>
          </Link>
          <span className="text-sm font-bold text-white mt-2">Store Map</span>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
