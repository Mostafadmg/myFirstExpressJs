import { API_BASE_URL } from "./config.js";

// Expects: GET /api/search?q=
// Returns: { listings: [...], users: [...] }
export async function search(query) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${API_BASE_URL}/search?${params}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.errors
      ?.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(detail || data?.message || "Search failed.");
  }

  return data;
}
