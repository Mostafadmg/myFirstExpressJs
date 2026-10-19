import { pool } from "../db.js";

export async function getCategories(req, res) {
  const sql = `--sql
    SELECT
      id,
      slug,
      name
    FROM
      categories
    ORDER BY
      id
  `;

  const result = await pool.query(sql);

  return res.json(result.rows);
}
