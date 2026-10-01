import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

// Wrap any <Route element={...}> that should only render for a logged-in
// user. This is a CLIENT-side convenience only (it just hides the page and
// redirects) â€” it is not security. The real gate is the Express middleware
// that checks the token on every request; a user could still hit the API
// directly. Never trust the frontend to be the only line of defense.
export function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div className="page"><LoadingSpinner /></div>;
  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
}
