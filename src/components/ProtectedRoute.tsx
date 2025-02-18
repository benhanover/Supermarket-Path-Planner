import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuthenticator((context) => [context.user]);

  return user ? children : <Navigate to="/" />;
}
