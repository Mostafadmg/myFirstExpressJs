import { request } from "./config.js";

// Expects: GET /api/conversations
export async function getConversations() {
  return request("/conversations");
}

// Expects: GET /api/conversations/:id/messages
export async function getMessages(conversationId) {
  return request(`/conversations/${conversationId}/messages`);
}

// Expects: POST /api/conversations/:id/messages  body: { text }
export async function sendMessage(conversationId, text) {
  return request(`/conversations/${conversationId}/messages`, { method: "POST", body: { text } });
}

// Expects: POST /api/conversations  body: { recipientId, listingId? }
export async function startConversation(recipientId, listingId) {
  return request("/conversations", { method: "POST", body: { recipientId, listingId } });
}
