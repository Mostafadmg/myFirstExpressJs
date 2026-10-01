import { request } from "./config.js";

// Expects: GET /api/listings/:listingId/availability?date=YYYY-MM-DD
// Returns: { slots: [{ start, end, isAvailable }] }
export async function getAvailability(listingId, date) {
  return request(`/listings/${listingId}/availability?date=${date}`);
}

// Expects: POST /api/bookings  body: { listingId, start, end }
// Another concurrency-sensitive endpoint: two people booking the same slot
// at the same time is the same class of bug as the checkout race above.
export async function createBooking(listingId, start, end) {
  return request("/bookings", { method: "POST", body: { listingId, start, end } });
}

// Expects: GET /api/bookings/mine
export async function getMyBookings() {
  return request("/bookings/mine");
}

// Expects: POST /api/bookings/:id/cancel
export async function cancelBooking(bookingId) {
  return request(`/bookings/${bookingId}/cancel`, { method: "POST" });
}
