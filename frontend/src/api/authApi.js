import { request, setToken, clearToken } from "./config.js";

// Expects: POST /api/auth/register  body: { name, email, password }
// Returns: { user, token }
export async function register(name, email, password) {
  const data = await request("/auth/register", { method: "POST", body: { name, email, password } });
  setToken(data.token);
  return data.user;
}

// Expects: POST /api/auth/login  body: { email, password }
// Returns: { user, token }
export async function login(email, password) {
  const data = await request("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data.user;
}

// Expects: POST /api/auth/logout (invalidate refresh token / session server-side)
export async function logout() {
  await request("/auth/logout", { method: "POST" });
  clearToken();
}

// Expects: GET /api/auth/me  (reads the token/cookie, returns the current user)
export async function getCurrentUser() {
  return request("/auth/me");
}

// Expects: POST /api/auth/forgot-password  body: { email }
export async function forgotPassword(email) {
  return request("/auth/forgot-password", { method: "POST", body: { email } });
}

// Expects: POST /api/auth/reset-password  body: { token, newPassword }
export async function resetPassword(token, newPassword) {
  return request("/auth/reset-password", { method: "POST", body: { token, newPassword } });
}
