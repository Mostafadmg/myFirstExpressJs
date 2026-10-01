import { request } from "./config.js";

// Expects: GET /api/favorites
export async function getFavorites() {
  return request("/favorites");
}

// Expects: POST /api/favorites  body: { listingId }
export async function addFavorite(listingId) {
  return request("/favorites", { method: "POST", body: { listingId } });
}

// Expects: DELETE /api/favorites/:listingId
export async function removeFavorite(listingId) {
  return request(`/favorites/${listingId}`, { method: "DELETE" });
}
