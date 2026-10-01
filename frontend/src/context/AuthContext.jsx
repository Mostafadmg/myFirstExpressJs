import { createContext, useState, useEffect } from "react";
import { getCurrentUser, login as loginApi, logout as logoutApi, register as registerApi } from "../api/authApi.js";
import { getToken, USE_PLACEHOLDER_API, TEST_ACCOUNT } from "../api/config.js";

// Single source of truth for "who is logged in right now" so any component
// can read it without prop-drilling user/role through every layer. This is
// a legitimate use of Context (cross-cutting, read-everywhere data) â€” unlike
// stuffing every bit of UI state in here, which would be the YAGNI mistake.
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On page load, if a token exists, ask the backend who it belongs to.
    // Runs once (empty dependency array) â€” don't repeat the infinite-loop
    // mistake from the Animal Shelter project.
    async function loadUser() {
      try {
        // No saved token means a fresh visit. Sign in as the test seller
        // so the navbar, cart, and new listings all have a user. A token
        // that is already saved (a different login) is left alone.
        if (!getToken() && USE_PLACEHOLDER_API) {
          const user = await loginApi(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
          setCurrentUser(user);
          return;
        }
        if (!getToken()) {
          setCurrentUser(null);
          return;
        }
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const user = await loginApi(email, password);
    setCurrentUser(user);
    return user;
  }

  async function register(name, email, password) {
    const user = await registerApi(name, email, password);
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    await logoutApi();
    setCurrentUser(null);
  }

  const value = { currentUser, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
