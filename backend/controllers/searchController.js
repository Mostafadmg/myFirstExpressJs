import { pool } from "../db.js";
import { photoUrl } from "../config.js";

export async function search(req, res) {
  const pattern = `%${req.validatedQuery.q}%`;

  const [listingResult, userResult] = await Promise.all([
    pool.query(
      `--sql
        SELECT
          listings.id,
          listings.title,
          listings.price AS "priceInCents",
          listings.type,
          categories.name AS category,
          listing_photos.file_path AS "photoPath",
          (
            SELECT AVG(reviews.rating)
            FROM reviews
            WHERE reviews.listing_id = listings.id
          ) AS "averageRating"
        FROM listings
        JOIN categories ON categories.id = listings.category_id
        LEFT JOIN listing_photos
          ON listing_photos.listing_id = listings.id
          AND listing_photos.sort_order = 0
        WHERE listings.title ILIKE $1
          OR listings.description ILIKE $1
          OR categories.name ILIKE $1
        ORDER BY listings.created_at DESC, listings.id DESC
        LIMIT 8
      `,
      [pattern],
    ),
    pool.query(
      `--sql
        SELECT id, name, role, bio, location, avatar_path AS "avatarPath"
        FROM users
        WHERE name ILIKE $1 OR bio ILIKE $1 OR location ILIKE $1
        ORDER BY name
        LIMIT 8
      `,
      [pattern],
    ),
  ]);

  return res.json({
    listings: listingResult.rows.map(({ photoPath, averageRating, ...listing }) => ({
      ...listing,
      averageRating: averageRating === null ? null : Number(averageRating),
      photoUrl: photoPath ? photoUrl(photoPath) : null,
    })),
    users: userResult.rows.map(({ avatarPath, ...user }) => ({
      ...user,
      avatarUrl: avatarPath ? photoUrl(avatarPath) : null,
    })),
  });
}
