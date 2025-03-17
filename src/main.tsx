import * as  React from "react";
import * as ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App";
import "./index.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import * as outputs from "../amplify_outputs.json";
import { AppProvider } from "./context/AppContext";

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
