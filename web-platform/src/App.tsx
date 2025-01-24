import "./App.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
function App() {
  const { signOut } = useAuthenticator();
  return (
    <>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default App;
