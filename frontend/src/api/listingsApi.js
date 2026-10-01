import { request } from "./config.js";

const url = "http://localhost:5000/api/listings";

export async function createListing(listing) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to create listing");
    }

    const createdListing = await response.json();
    return createdListing;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getListings(filters = {}) {
  const params = new URLSearchParams(filters);
  return request(`/listings?${params.toString()}`);
}

// Expects: GET /api/listings/:id
export async function getListingById(listingId) {
  return request(`/listings/${listingId}`);
}

// Expects: PATCH /api/listings/:id  body: partial listing fields
export async function updateListing(listingId, updates) {
  return request(`/listings/${listingId}`, { method: "PATCH", body: updates });
}

// Expects: DELETE /api/listings/:id
export async function deleteListing(listingId) {
  return request(`/listings/${listingId}`, { method: "DELETE" });
}

// Expects: POST /api/listings/:id/photos  multipart/form-data, field "photos" (multiple)
export async function uploadListingPhotos(listingId, files) {
  const formData = new FormData();
  for (const file of files) formData.append("photos", file);
  return request(`/listings/${listingId}/photos`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// Expects: GET /api/listings/mine  (current seller's own listings)
export async function getMyListings() {
  return request("/listings/mine");
}
