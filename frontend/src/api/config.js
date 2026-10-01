// One place that knows where the Express server lives. Change this when
// your backend runs on a different port, or point it at a deployed URL.
export const API_BASE_URL = "http://localhost:5000/api";

// The React app can run before any Express server exists. While this is
// true, request() answers from src/api/placeholderApi.js (photos, carts,
// bookings, and the rest live in the browser). Set it to false once your
// own server is answering on API_BASE_URL.
export const USE_PLACEHOLDER_API = true;

// Seeded seller in placeholderApi.js. The app signs in as this account on
// load while the placeholder is on, so protected pages work without a
// manual login. The password is the one in that seed, not a real secret.
export const TEST_ACCOUNT = {
  email: "mostafa@marketspace.test",
  password: "password",
};

// getToken/setToken/clearToken: placeholder auth-token storage. Once you
// build real auth in Express, decide here whether you're using a JWT in
// localStorage or an HttpOnly cookie (cookies need no JS access at all —
// revisit this file when you reach the Auth phase).
export function getToken() {
  return localStorage.getItem("marketspace_token");
}

export function setToken(token) {
  localStorage.setItem("marketspace_token", token);
}

export function clearToken() {
  localStorage.removeItem("marketspace_token");
}

// A single wrapper around fetch so every api/*.js file doesn't repeat the
// same boilerplate: set headers, attach the auth token, parse JSON, and
// turn a non-2xx response into a thrown Error with a useful message.
export async function request(path, { method = "GET", body, isFormData = false } = {}) {
  if (USE_PLACEHOLDER_API) {
    const { handlePlaceholderRequest } = await import("./placeholderApi.js");
    return handlePlaceholderRequest(path, { method, body, isFormData, token: getToken() });
  }

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
