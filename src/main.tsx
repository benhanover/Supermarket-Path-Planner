import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import { AppProvider } from "./context/AppContext.tsx";

Amplify.configure(outputs);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </AppProvider>
  </React.StrictMode>
);
