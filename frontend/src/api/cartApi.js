import { request } from "./config.js";

// Expects: GET /api/cart
// Returns: { items: [{ listingId, title, price, quantity }], total }
export async function getCart() {
  return request("/cart");
}

// Expects: POST /api/cart/items  body: { listingId, quantity }
export async function addToCart(listingId, quantity = 1) {
  return request("/cart/items", { method: "POST", body: { listingId, quantity } });
}

// Expects: PATCH /api/cart/items/:listingId  body: { quantity }
export async function updateCartItem(listingId, quantity) {
  return request(`/cart/items/${listingId}`, { method: "PATCH", body: { quantity } });
}

// Expects: DELETE /api/cart/items/:listingId
export async function removeFromCart(listingId) {
  return request(`/cart/items/${listingId}`, { method: "DELETE" });
}

// Expects: DELETE /api/cart
export async function clearCart() {
  return request("/cart", { method: "DELETE" });
}
