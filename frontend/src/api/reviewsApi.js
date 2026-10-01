import { request } from "./config.js";

// Expects: GET /api/listings/:listingId/reviews
export async function getReviewsForListing(listingId) {
  return request(`/listings/${listingId}/reviews`);
}

// Expects: POST /api/listings/:listingId/reviews  body: { rating, comment }
export async function createReview(listingId, rating, comment) {
  return request(`/listings/${listingId}/reviews`, { method: "POST", body: { rating, comment } });
}

// Expects: DELETE /api/reviews/:reviewId
export async function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, { method: "DELETE" });
}
