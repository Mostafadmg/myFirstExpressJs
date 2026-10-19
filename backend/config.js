export const PORT = Number(process.env.PORT || 5000);
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
export const PUBLIC_API_ORIGIN = (process.env.PUBLIC_API_ORIGIN || `http://localhost:${PORT}`).replace(/\/+$/, "");

export function photoUrl(filePath) {
  return `${PUBLIC_API_ORIGIN}/photos/${filePath}`;
}
