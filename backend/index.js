import express from "express";
import cors from "cors";
import listingsRouter from "./routes/listings.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use("/photos", express.static("photos"));
app.use("/api/listings", listingsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
