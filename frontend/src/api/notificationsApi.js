import { request } from "./config.js";

// Expects: GET /api/notifications
export async function getNotifications() {
  return request("/notifications");
}

// Expects: PATCH /api/notifications/:id/read
export async function markAsRead(notificationId) {
  return request(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

// Expects: PATCH /api/notifications/read-all
export async function markAllAsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}
