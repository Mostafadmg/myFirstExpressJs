import { request } from "./config.js";

// Every function here should map to an Express route protected by BOTH
// "is logged in" middleware and "is admin" middleware — two separate
// checks (authentication vs authorization) stacked on the same route.

// Expects: GET /api/admin/users?page=&limit=
export async function getAllUsers(page = 1, limit = 20) {
  return request(`/admin/users?page=${page}&limit=${limit}`);
}

// Expects: PATCH /api/admin/users/:id/ban
export async function banUser(userId) {
  return request(`/admin/users/${userId}/ban`, { method: "PATCH" });
}

// Expects: PATCH /api/admin/users/:id/role  body: { role }
export async function changeUserRole(userId, role) {
  return request(`/admin/users/${userId}/role`, { method: "PATCH", body: { role } });
}

// Expects: GET /api/admin/listings?page=&limit=
export async function getAllListingsForModeration(page = 1, limit = 20) {
  return request(`/admin/listings?page=${page}&limit=${limit}`);
}

// Expects: DELETE /api/admin/listings/:id
export async function removeListing(listingId) {
  return request(`/admin/listings/${listingId}`, { method: "DELETE" });
}

// Expects: GET /api/admin/stats
// Returns: { totalUsers, totalListings, totalOrders, revenueCents, ... }
export async function getPlatformStats() {
  return request("/admin/stats");
}
