import { API_BASE_URL, request } from "./config.js";

// GET /api/listings/:listingId/reviews from Express, not the placeholder list.
export async function getReviewsForListing(listingId) {
  const response = await fetch(`${API_BASE_URL}/listings/${listingId}/reviews`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to fetch reviews.");
  }
  return response.json();
}

// Expects: POST /api/listings/:listingId/reviews  body: { rating, comment }
export async function createReview(listingId, rating, comment) {
  return request(`/listings/${listingId}/reviews`, { method: "POST", body: { rating, comment } });
}

// Expects: DELETE /api/reviews/:reviewId
export async function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, { method: "DELETE" });
}
