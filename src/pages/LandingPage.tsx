// import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FormFields } from "../types";

// const formFields: FormFields = {
//   signUp: {
//     nickname: {
//       label: "Supermarket name",
//       placeholder: "Enter your supermarket name",
//       required: true,
//     },
//     address: {
//       label: "Supermarket Address",
//       placeholder: "Enter Supermarket address",
//       required: true,
//     },
//   },
// };

// export default function LandingPage() {
//   const { user } = useAuthenticator((context) => [context.user]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate("/home");
//     }
//   }, [user, navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Welcome to SuperMarket App
//         </h1>
//         <p className="text-center text-gray-600 mb-6">
//           Sign in or create an account to get started.
//         </p>

//         {!user && (
//           <Authenticator
//             formFields={formFields}
//             signUpAttributes={["birthdate", "nickname"]}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormFields } from "../types";

const formFields: FormFields = {
  signUp: {
    nickname: {
      label: "Supermarket Name",
      placeholder: "Enter your supermarket name",
      required: true,
    },
    address: {
      label: "Supermarket Address",
      placeholder: "Enter your supermarket address",
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
              <Authenticator
                formFields={formFields}
                signUpAttributes={["birthdate", "nickname"]}
                className="!w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
