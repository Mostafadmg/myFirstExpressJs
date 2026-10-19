import { pool } from "../db.js";
import { photoUrl } from "../config.js";

export async function getUser(req, res) {
  const id = req.params.id;

  const sql = `--sql
    SELECT
      *
    FROM
      users
    WHERE
      id = $1
  `;

  const result = await pool.query(sql, [id]);
  const user = result.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const newResult = {
    id: user.id,
    name: user.name,
    role: user.role,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatar_path ? photoUrl(user.avatar_path) : null,
    coverPhotoUrl: user.cover_photo_path ? photoUrl(user.cover_photo_path) : null,
  };

  return res.json(newResult);
}
