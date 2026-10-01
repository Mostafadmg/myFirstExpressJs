import { request } from "./config.js";

// Expects: GET /api/listings/:listingId/comments
export async function getCommentsForListing(listingId) {
  return request(`/listings/${listingId}/comments`);
}

// Expects: POST /api/listings/:listingId/comments  body: { text }
export async function createComment(listingId, text) {
  return request(`/listings/${listingId}/comments`, { method: "POST", body: { text } });
}

// Expects: DELETE /api/comments/:commentId
export async function deleteComment(commentId) {
  return request(`/comments/${commentId}`, { method: "DELETE" });
}
