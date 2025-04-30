import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useAppContext } from "../context/AppContext";
import { NavBar } from "../components/Navbar";

const SignInPage: React.FC = () => {
  const { setUser } = useAppContext();
  const { user } = useAuthenticator();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUser(user);
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-purple-100 to-white overflow-auto">
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 -z-10"
      />

      <NavBar />

      <main className="flex items-center justify-center py-16 px-4 animate-fade-in">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-xl p-0">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-center text-purple-800 mb-6">
              Sign In to Supermarket Planner
            </h2>
            <div
              className="w-full mx-auto rounded-lg overflow-hidden
              [&_.amplify-tabs__list]:justify-center
              [&_.amplify-tabs__list]:gap-8
              [&_.amplify-tabs__list]:mb-4
              [&_.amplify-tabs__button]:text-purple-800
              [&_.amplify-tabs__button--active]:border-b-2
              [&_.amplify-tabs__button--active]:border-purple-600
              [&_.amplify-tabs__content]:p-4
              [&_.amplify-field__control]:border
              [&_.amplify-field__control]:border-gray-300
              [&_.amplify-field__control]:rounded-md
              [&_.amplify-field__control]:pl-10
              [&_.amplify-field__control]:focus:ring-2
              [&_.amplify-field__control]:focus:ring-purple-500
              [&_.amplify-field__control]:focus:border-purple-500
              [&_.amplify-field]:relative
              [&_.amplify-button]:bg-gradient-to-r
              [&_.amplify-button]:from-purple-600
              [&_.amplify-button]:to-pink-500
              [&_.amplify-button]:hover:from-purple-700
              [&_.amplify-button]:hover:to-pink-600
              [&_.amplify-button]:text-white
              [&_.amplify-button]:font-semibold
              [&_.amplify-button]:rounded-lg
              [&_.amplify-button]:shadow-md
              [&_.amplify-button]:transition-all
              [&_.amplify-button]:duration-300"
            >
              <Authenticator />
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account? <a href="#" className="text-purple-700 hover:underline">Contact Admin</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
