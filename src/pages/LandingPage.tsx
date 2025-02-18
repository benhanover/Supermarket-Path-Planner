import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormFields } from "../types";

const formFields: FormFields = {
  signUp: {
    nickname: {
      label: "Supermarket name",
      placeholder: "Enter your supermarket name",
      required: true,
    },
    address: {
      label: "Supermarket Address",
      placeholder: "Enter Supermarket address",
      required: true,
    },
  },
};

export default function LandingPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome to SuperMarket App
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in or create an account to get started.
        </p>

        {!user && (
          <Authenticator
            formFields={formFields}
            signUpAttributes={["birthdate", "nickname"]}
          />
        )}
      </div>
    </div>
  );
}
