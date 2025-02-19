// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Authenticator } from "@aws-amplify/ui-react";
// import App from "./App.tsx";
// import "./index.css";
// import { Amplify } from "aws-amplify";
// import "@aws-amplify/ui-react/styles.css";
// import outputs from "../amplify_outputs.json";

// Amplify.configure(outputs);
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <Authenticator.Provider>
//       <App />
//     </Authenticator.Provider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

// Load amplify_outputs.json dynamically to prevent build failures in CI
async function configureAmplify() {
  try {
    const outputs = await import("../amplify_outputs.json");
    Amplify.configure(outputs.default);
  } catch (error) {
    console.warn("amplify_outputs.json not found.");
  }
}

configureAmplify();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
);
