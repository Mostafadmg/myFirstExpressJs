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
      const failedResponse = await response.json();
      const errorMsg =
        failedResponse.errors
          ?.map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ") ||
        failedResponse.message ||
        "Failed to create listing";

      throw new Error(errorMsg);
    }

    const createdListing = await response.json();
    return createdListing;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadListingPhotos(id, photos) {
  try {
    const formData = new FormData();
    const photoURL = `http://localhost:5000/api/listings/${id}/photos`;
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const response = await fetch(photoURL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const body = await response.text();
      const pre = body.match(/<pre>([\s\S]*?)<\/pre>/);
      const message = pre
        ? pre[1]
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/&nbsp;/g, " ")
            .replace(/<[^>]+>/g, "")
            .trim()
        : body.trim();
      throw new Error(message || `Photo upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getListings(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Failed to fetch listings.");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

// GET /api/listings/:id from Express, not the placeholder list.
export async function getListingById(listingId) {
  const response = await fetch(`${url}/${listingId}`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Listing not found.");
  }
  return response.json();
}

// Expects: PATCH /api/listings/:id  body: partial listing fields
export async function updateListing(listingId, updates) {
  try {
    const response = await fetch(`${url}/${listingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const failedResponse = await response.json();
      const errorMsg =
        failedResponse.errors
          ?.map((issue) => {
            const field = issue.path.join(".");
            return field ? `${field}: ${issue.message}` : issue.message;
          })
          .join("; ") || failedResponse.message;

      throw new Error(errorMsg);
    }

    const updatedListing = await response.json();
    console.log(updatedListing);
    return updatedListing;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Expects: DELETE /api/listings/:id
export async function deleteListing(listingId) {
  try {
    const response = await fetch(`${url}/${listingId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Could not delete the listing");
    }

    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
}

// Expects: GET /api/listings/mine  (current seller's own listings)
export async function getMyListings() {
  return request("/listings/mine");
}
