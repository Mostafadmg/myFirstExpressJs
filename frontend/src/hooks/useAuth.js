import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Small wrapper so components write `useAuth()` instead of
// `useContext(AuthContext)` everywhere, and so a missing <AuthProvider>
// fails loudly instead of silently returning null.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
