import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormFields } from "../types";

const formFields: FormFields = {
  signUp: {
    address: {
      label: "Supermarket Address",
      placeholder: "Enter your supermarket address",
      required: true,
    },
    "custom:layout_rows": {
      label: "Number of Rows",
      placeholder: "Enter the number of rows",
      required: true,
    },
    "custom:layout_cols": {
      label: "Number of Columns",
      placeholder: "Enter the number of columns",
      required: true,
    },
    "custom:supermarket_name": {
      label: "Supermarket Name",
      placeholder: "Enter your supermarket name",
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
            {/* Authenticator centered inside the full-width card */}
            <div className="w-full max-w-md">
              <Authenticator formFields={formFields} className="!w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
