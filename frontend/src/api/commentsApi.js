import { request } from "./config.js";

const url = "http://localhost:5000/api/listings";

// Expects: GET /api/listings/:listingId/comments
export async function getCommentsForListing(listingId) {
  try {
    const response = await fetch(`${url}/${listingId}/comments`);

    if (!response.ok) {
      throw new Error("Comments Could not be fetch from the API");
    }
    return response.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Expects: POST /api/listings/:listingId/comments  body: { text }
export async function createComment(listingId, text) {
  return request(`/listings/${listingId}/comments`, { method: "POST", body: { text } });
}

// Expects: DELETE /api/comments/:commentId
export async function deleteComment(commentId) {
  return request(`/comments/${commentId}`, { method: "DELETE" });
}
