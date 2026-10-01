import { request } from "./config.js";

// Expects: GET /api/categories
export async function getCategories() {
  return request("/categories");
}
