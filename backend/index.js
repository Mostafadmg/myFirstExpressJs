import express from "express";
import cors from "cors";
import { pathToFileURL } from "node:url";
import listingsRouter from "./routes/listings.js";
import categoryRouter from "./routes/categories.js";
import usersRouter from "./routes/users.js";
import searchRouter from "./routes/search.js";
import { pool } from "./db.js";
import { FRONTEND_ORIGIN, PORT } from "./config.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";

export const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  }),
);

app.use(express.json());
app.use("/photos", express.static("photos"));
app.use("/api/listings", listingsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", usersRouter);
app.use("/api/search", searchRouter);

app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  return res.json({ status: "ok", database: "ok" });
});

app.use(notFound);
app.use(errorHandler);

// Start listening only when this file is executed directly. Keeping app
// creation separate lets automated tests import the Express app safely.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
