const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const { pool } = require("./db");

// 1. Allow requests from your React frontend
app.use(
  cors({
    origin: "http://localhost:5174",
  }),
);

// 2. Parse incoming JSON request bodies
app.use(express.json());

// 3. Your API routes
app.get("/api/health", async (req, res) => {
  const result = await pool.query("SELECT NOW()");

  res.json({
    status: "ok",
    message: result.rows[0].now,
  });
});

app.post("/api/listings", (req, res) => {
  res.status(201).json({
    received: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
