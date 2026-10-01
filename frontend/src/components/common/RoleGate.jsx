import { useAuth } from "../../hooks/useAuth.js";

// Shows children only if the current user's role is in `allow`. Same
// caveat as ProtectedRoute: this hides a button, it does not protect the
// endpoint behind it. The Express route itself must re-check the role.
export function RoleGate({ allow, children }) {
  const { currentUser } = useAuth();
  if (!currentUser || !allow.includes(currentUser.role)) return null;
  return children;
}
