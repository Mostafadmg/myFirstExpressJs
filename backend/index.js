const express = require("express");
const cors = require("cors");
const path = require("path");
const { pool } = require("./db.js");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5000;
const PHOTOS_BASE_URL = `http://localhost:${PORT}/photos`;

function photoUrl(filePath) {
  return `${PHOTOS_BASE_URL}/${filePath}`;
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/listings");
  },

  filename: function (req, file, cb) {
    const base = sanitizeFilename(file.originalname) || "photo";
    cb(null, `${req.params.id}-${base}.jpg`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/photos", express.static("photos"));

// 3. Your API routes
app.get("/api/health", async (req, res) => {
  res.json({
    status: "ok",
    message: result.rows[0].now,
  });
});

app.post("/api/listings", async (req, res) => {
  const result = await pool.query(
    `
    INSERT INTO listings
      (title, description, price, type, category_id, stock)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *
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
});

app.get("/api/listings", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  const countResult = await pool.query("SELECT COUNT(*)::int AS total FROM listings");
  const total = countResult.rows[0].total;

  // STEP 3 (learner — next session): main SELECT with JOINs on categories +
  // listing_photos (sort_order = 0 for thumbnail), LIMIT/OFFSET, map photoUrl,
  // then res.json({ listings, total, page, totalPages: Math.ceil(total / limit) })
});

app.get("/api/listings/:id", async (req, res) => {
  const result = await pool.query(
    `
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
          json_build_object('filePath', listing_photos.file_path, 'sortOrder', listing_photos.sort_order)
          ORDER BY listing_photos.sort_order
        ) FILTER (WHERE listing_photos.id IS NOT NULL),
        '[]'
      ) AS photos_meta
    FROM listings
    JOIN categories ON categories.id = listings.category_id
    LEFT JOIN listing_photos ON listing_photos.listing_id = listings.id
    WHERE listings.id = $1
    GROUP BY listings.id, categories.name, categories.slug
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
});

app.post("/api/listings/:id/photos", upload.array("photos", 5), async (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ message: "No photos received." });
  }

  const listingId = req.params.id;
  const countResult = await pool.query(
    "SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM listing_photos WHERE listing_id = $1",
    [listingId],
  );
  let nextSort = countResult.rows[0].max_sort + 1;

  const saved = [];
  for (const file of req.files) {
    const filePath = path.join("listings", file.filename).replace(/\\/g, "/");
    await pool.query(
      "INSERT INTO listing_photos (listing_id, file_path, sort_order) VALUES ($1, $2, $3)",
      [listingId, filePath, nextSort],
    );
    saved.push({ filePath, url: photoUrl(filePath), sortOrder: nextSort });
    nextSort += 1;
  }

  res.status(201).json({ photos: saved });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
