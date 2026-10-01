import { request } from "./config.js";

// Expects: POST /api/orders/checkout  body: { shippingAddress, paymentMethodStub }
// This is the endpoint where a real backend must do this atomically in a
// transaction: verify stock, decrement it, create the order + order_items,
// and clear the cart. Skipping the transaction is how two buyers both
// "win" the last item in stock (a race condition you'll learn to prevent).
export async function checkout(shippingAddress) {
  return request("/orders/checkout", { method: "POST", body: { shippingAddress } });
}

// Expects: GET /api/orders?page=&limit=
export async function getMyOrders(page = 1, limit = 10) {
  return request(`/orders?page=${page}&limit=${limit}`);
}

// Expects: GET /api/orders/:id
export async function getOrderById(orderId) {
  return request(`/orders/${orderId}`);
}

// Expects: POST /api/orders/:id/cancel
export async function cancelOrder(orderId) {
  return request(`/orders/${orderId}/cancel`, { method: "POST" });
}
