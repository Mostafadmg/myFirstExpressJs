import { API_BASE_URL, request } from "./config.js";

export async function getUserProfile(userId) {
  try {
    // The placeholder app uses u1-u4; the seeded PostgreSQL users use integer IDs.
    const placeholderIdToDatabaseId = {
      u1: 1, // Mostafa Adel
      u2: 3, // Lina Ortega
      u3: 4, // Idris Cole
      u4: 2, // Nora Hale
    };
    const databaseUserId = placeholderIdToDatabaseId[userId] ?? userId;
    const response = await fetch(`${API_BASE_URL}/users/${databaseUserId}`);

    if (!response.ok) {
      const failure = await response.json().catch(() => null);
      throw new Error(failure?.message || `User request failed (${response.status}).`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Expects: PATCH /api/users/:id  body: { name?, bio?, location? }
export async function updateProfile(userId, updates) {
  return request(`/users/${userId}`, { method: "PATCH", body: updates });
}

// Expects: POST /api/users/:id/avatar  multipart/form-data, field "avatar"
export async function uploadAvatar(userId, file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return request(`/users/${userId}/avatar`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// Expects: POST /api/users/:id/cover-photo  multipart/form-data, field "coverPhoto"
export async function uploadCoverPhoto(userId, file) {
  const formData = new FormData();
  formData.append("coverPhoto", file);
  return request(`/users/${userId}/cover-photo`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
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
