const express = require("express");
const cors = require("cors");
const { pool } = require("./db.js");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos");
  },

  filename: function (req, file, cb) {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

// 1. Allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 2. Parse incoming JSON request bodies
app.use(express.json());

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

// Photo upload

app.post("/api/listings/:id/photos", upload.array("photos", 5), (req, res) => {
  console.log(req.files);
  res.json({ message: "Received" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
