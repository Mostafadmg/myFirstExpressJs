import { request } from "./config.js";

// Expects: GET /api/users/:id
export async function getUserProfile(userId) {
  return request(`/users/${userId}`);
}

// Expects: PATCH /api/users/:id  body: { name?, bio?, location? }
export async function updateProfile(userId, updates) {
  return request(`/users/${userId}`, { method: "PATCH", body: updates });
}

// Expects: POST /api/users/:id/avatar  multipart/form-data, field "avatar"
export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return request(`/users/${userId}/avatar`, { method: "POST", body: formData, isFormData: true });
}

// Expects: POST /api/users/:id/cover-photo  multipart/form-data, field "coverPhoto"
export async function uploadCoverPhoto(userId, file) {
  const formData = new FormData();
  formData.append("coverPhoto", file);
  return request(`/users/${userId}/cover-photo`, { method: "POST", body: formData, isFormData: true });
}

// Expects: POST /api/users/:id/follow
export async function followUser(userId) {
  return request(`/users/${userId}/follow`, { method: "POST" });
}

// Expects: DELETE /api/users/:id/follow
export async function unfollowUser(userId) {
  return request(`/users/${userId}/follow`, { method: "DELETE" });
}

// Expects: GET /api/users/:id/followers
export async function getFollowers(userId) {
  return request(`/users/${userId}/followers`);
}

// Expects: GET /api/users/:id/following
export async function getFollowing(userId) {
  return request(`/users/${userId}/following`);
}
