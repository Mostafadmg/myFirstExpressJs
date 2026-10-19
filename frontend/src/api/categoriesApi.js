import { API_BASE_URL } from "./config.js";

export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Categories API has failed");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
