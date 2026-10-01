import { request } from "./config.js";

// Expects: GET /api/search?q=
// Returns: { listings: [...], users: [...] }
export async function search(query) {
  return request(`/search?q=${encodeURIComponent(query)}`);
}
