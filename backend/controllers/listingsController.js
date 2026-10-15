import path from "path";
import { pool } from "../db.js";

const PORT = process.env.PORT || 5000;
const PHOTOS_BASE_URL = `http://localhost:${PORT}/photos`;

function photoUrl(filePath) {
  return `${PHOTOS_BASE_URL}/${filePath}`;
}

export async function createListing(req, res) {
  const categoryResult = await pool.query(
    `--sql
      SELECT
        id
      FROM
        categories
      WHERE
        slug = $1
    `,
    [req.body.category],
  );

  if (categoryResult.rows.length === 0) {
    return res.status(400).json({
      message: "Unkown category.",
    });
  }

  const result = await pool.query(
    `--sql
      INSERT INTO
        listings (
          title,
          description,
          price,
          type,
          category_id,
          stock,
          seller_id
        )
      VALUES
        (
          $1,
          $2,
          $3,
          $4,
          (
            SELECT
              id
            FROM
              categories
            WHERE
              slug = $5
          ),
          $6,
          $7
        )
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
      // TODO: replace with logged-in user's id after auth
      1,
    ],
  );

  const listing = result.rows[0];
  console.log(listing);
  res.status(201).json(listing);
}

export async function getListings(req, res) {
  const result = req.validatedQuery;

  const page = result.page;
  const limit = result.limit;
  const q = result.q;
  const minPrice = result.minPrice;
  const maxPrice = result.maxPrice;
  const category = result.category;
  const sort = result.sort;
  const offset = (page - 1) * limit;

  const minPriceCents = minPrice === undefined ? null : minPrice * 100;
  const maxPriceCents = maxPrice === undefined ? null : maxPrice * 100;

  let orderBy = "listings.created_at DESC";

  if (sort === "price_asc") {
    orderBy = "listings.price ASC";
  } else if (sort === "price_desc") {
    orderBy = "listings.price DESC";
  } else if (sort === "newest") {
    orderBy = "listings.created_at DESC";
  } else if (sort === "rating_desc") {
    orderBy = '"averageRating" DESC NULLS LAST';
  }
  const filterParams = [category, q ? `%${q}%` : null, minPriceCents, maxPriceCents];

  const whereSql = `--sql
    WHERE
      (
        $1::text IS NULL
        OR categories.slug = $1
      )
      AND (
        $2::text IS NULL
        OR listings.title ILIKE $2
        OR listings.description ILIKE $2
      )
      AND (
        $3::integer IS NULL
        OR listings.price >= $3
      )
      AND (
        $4::integer IS NULL
        OR listings.price <= $4
      )
  `;

  const sql = `--sql
    SELECT
      listings.id,
      listings.title,
      listings.price AS "priceInCents",
      (
        SELECT
          AVG(rating)
        FROM
          reviews
        WHERE
          reviews.listing_id = listings.id
      ) AS "averageRating",
      listings.type,
      categories.name AS category,
      listing_photos.file_path
    FROM
      listings
      JOIN categories ON categories.id = listings.category_id
      LEFT JOIN listing_photos ON listing_photos.listing_id = listings.id
      AND listing_photos.sort_order = 0 ${whereSql}
    ORDER BY
      ${orderBy},
      listings.id DESC
    LIMIT
      $5
    OFFSET
      $6
  `;

  const countSql = `--sql
    SELECT
      COUNT(*)::int AS total
    FROM
      listings
      JOIN categories ON categories.id = listings.category_id ${whereSql}
  `;

  const listResults = await pool.query(sql, [...filterParams, limit, offset]);
  const listings = listResults.rows.map((row) => ({
    id: row.id,
    title: row.title,
    priceInCents: row.priceInCents,
    type: row.type,
    category: row.category,
    photoUrl: row.file_path ? photoUrl(row.file_path) : null,
    averageRating: Number(row.averageRating) || 0,
  }));

  const countResult = await pool.query(countSql, filterParams);
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

export async function getCommentsForListing(req, res) {
  const id = req.params.id;

  const sql = `--sql
    SELECT
      comments.listing_id,
      comments.id,
      comments.body AS text,
      users.name AS "authorName",
      comments.created_at AS "createdAt"
    FROM
      comments
      JOIN users ON users.id = comments.user_id
    WHERE
      comments.listing_id = $1
    ORDER BY
      comments.created_at
  `;

  const result = await pool.query(sql, [id]);

  const comments = result.rows;
  res.json(comments);
}

export async function getReviewsForListing(req, res) {
  const id = req.params.id;

  const sql = `--sql
    SELECT
      reviews.id,
      reviews.user_id AS "userId",
      reviews.rating,
      reviews.body AS comment,
      users.name AS "authorName"
    FROM
      reviews
      JOIN users ON users.id = reviews.user_id
    WHERE
      reviews.listing_id = $1
    ORDER BY
      reviews.created_at
  `;

  const result = await pool.query(sql, [id]);
  res.json(result.rows);
}

export async function updateListing(req, res) {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json("id must be a number, cannot be a string");
  }

  const { title, description, priceInCents, type, category, stock } = req.body;
  const hasStock = Object.hasOwn(req.body, "stock");

  const sql = `--sql
    UPDATE listings
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      price = COALESCE($3, price),
      type = COALESCE($4, type),
      stock = CASE WHEN $5 THEN $6 ELSE stock END,
      category_id = COALESCE(
        (
          SELECT
            id
          FROM
            categories
          WHERE
            slug = $7
        ),
        category_id
      )
    WHERE
      id = $8
    RETURNING
      id,
      title,
      description,
      price AS "priceInCents",
      type,
      stock;
  `;

  try {
    const result = await pool.query(sql, [
      title ?? null, // $1
      description ?? null, // $2
      priceInCents ?? null, // $3
      type ?? null, // $4
      hasStock, // $5: whether stock was supplied
      stock ?? null, // $6: supplied stock value, including explicit null
      category ?? null, // $7
      id, // $8
    ]);

    const updatedListing = result.rows[0];

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing Not Found" });
    }

    res.json(updatedListing);
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ message: "Failed to update listing" });
  }
}

export async function deleteListing(req, res) {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "ID must contain only digits",
    });
  }

  const sql = `--sql
    DELETE FROM listings
    WHERE
      id = $1
    RETURNING
      id;
  `;

  const result = await pool.query(sql, [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "No listing found" });
  }

  return res.json({ id: result.rows[0].id });
}
