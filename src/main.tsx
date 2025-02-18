import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(outputs);

// const formFields = {
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
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
);
