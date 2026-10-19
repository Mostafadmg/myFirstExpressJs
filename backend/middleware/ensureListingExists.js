import { pool } from "../db.js";

export async function ensureListingExists(req, res, next) {
  const result = await pool.query("SELECT id FROM listings WHERE id = $1", [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Listing not found." });
  }
  return next();
}
