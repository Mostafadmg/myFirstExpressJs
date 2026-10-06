import path from "path";
import { pool } from "../db.js";

const PORT = process.env.PORT || 5000;
const PHOTOS_BASE_URL = `http://localhost:${PORT}/photos`;

function photoUrl(filePath) {
  return `${PHOTOS_BASE_URL}/${filePath}`;
}

export async function createListing(req, res) {
  const result = await pool.query(
    `--sql
      INSERT INTO
        listings (
          title,
          description,
          price,
          type,
          category_id,
          stock
        )
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        *
    `,
    [
      req.body.title,
      req.body.description,
      req.body.priceInCents,
      req.body.type,
      req.body.category,
      req.body.stock,
    ],
  );
  const listing = result.rows[0];
  console.log(listing);
  res.status(201).json(listing);
}

export async function getListings(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  const category = req.query.category || null;
  const q = req.query.q || null;
  const minPrice = req.query.minPrice || null;
  const maxPrice = req.query.maxPrice || null;
  const sort = req.query.sort || null;

  let sql;
  let params;
  let countSql;
  let countParams;

  if (category) {
    sql = `--sql
      SELECT
        listings.id,
        listings.title,
        listings.price AS "priceInCents",
        listings.type,
        categories.name AS category,
        listing_photos.file_path
      FROM
        listings
        JOIN categories ON categories.id = listings.category_id
        LEFT JOIN listing_photos ON listing_photos.listing_id = listings.id
        AND listing_photos.sort_order = 0
      WHERE
        categories.slug = $1
      LIMIT
        $2
      OFFSET
        $3
    `;
    params = [category, limit, offset];
    countSql = `--sql
      SELECT
        COUNT(*)::int AS total
      FROM
        listings
        JOIN categories ON categories.id = listings.category_id
      WHERE
        categories.slug = $1
    `;
    countParams = [category];
  } else {
    sql = `--sql
      SELECT
        listings.id,
        listings.title,
        listings.price AS "priceInCents",
        listings.type,
        categories.name AS category,
        listing_photos.file_path
      FROM
        listings
        JOIN categories ON categories.id = listings.category_id
        LEFT JOIN listing_photos ON listing_photos.listing_id = listings.id
        AND listing_photos.sort_order = 0
      LIMIT
        $1
      OFFSET
        $2
    `;
    params = [limit, offset];
    countSql = "SELECT COUNT(*)::int AS total FROM listings";
    countParams = [];
  }

  const listResults = await pool.query(sql, params);
  const listings = listResults.rows.map((row) => ({
    id: row.id,
    title: row.title,
    priceInCents: row.priceInCents,
    type: row.type,
    category: row.category,
    photoUrl: row.file_path ? photoUrl(row.file_path) : null,
    averageRating: 0,
  }));

  const countResult = await pool.query(countSql, countParams);
  const total = countResult.rows[0].total;

  res.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
}

export async function getListingById(req, res) {
  const result = await pool.query(
    `--sql
      SELECT
        listings.id,
        listings.title,
        listings.description,
        listings.price AS "priceInCents",
        listings.type,
        listings.stock,
        categories.name AS category,
        categories.slug AS "categoryId",
        COALESCE(
          json_agg(
            json_build_object(
              'filePath',
              listing_photos.file_path,
              'sortOrder',
              listing_photos.sort_order
            )
            ORDER BY
              listing_photos.sort_order
          ) FILTER (
            WHERE
              listing_photos.id IS NOT NULL
          ),
          '[]'
        ) AS photos_meta
      FROM
        listings
        JOIN categories ON categories.id = listings.category_id
        LEFT JOIN listing_photos ON listing_photos.listing_id = listings.id
      WHERE
        listings.id = $1
      GROUP BY
        listings.id,
        categories.name,
        categories.slug
    `,
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Listing not found." });
  }

  const listing = result.rows[0];
  const photos = listing.photos_meta.map((photo) => photoUrl(photo.filePath));
  const { photos_meta, ...rest } = listing;

  res.json({
    ...rest,
    averageRating: 0,
    photoUrl: photos[0] ?? null,
    photos,
  });
}

export async function uploadListingPhotos(req, res) {
  if (!req.files?.length) {
    return res.status(400).json({ message: "No photos received." });
  }

  const listingId = req.params.id;
  const countResult = await pool.query(
    `--sql
      SELECT
        COALESCE(MAX(sort_order), -1) AS max_sort
      FROM
        listing_photos
      WHERE
        listing_id = $1
    `,
    [listingId],
  );
  let nextSort = countResult.rows[0].max_sort + 1;

  const saved = [];
  for (const file of req.files) {
    const filePath = path.join("listings", file.filename).replace(/\\/g, "/");
    await pool.query(
      `--sql
        INSERT INTO
          listing_photos (listing_id, file_path, sort_order)
        VALUES
          ($1, $2, $3)
      `,
      [listingId, filePath, nextSort],
    );
    saved.push({ filePath, url: photoUrl(filePath), sortOrder: nextSort });
    nextSort += 1;
  }

  res.status(201).json({ photos: saved });
}
