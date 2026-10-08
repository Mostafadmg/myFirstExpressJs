import express from "express";
import multer from "multer";
import {
  createListing,
  getListings,
  getListingById,
  uploadListingPhotos,
  getCommentsForListing,
  getReviewsForListing,
} from "../controllers/listingsController.js";

const router = express.Router();

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

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/:id/photos", upload.array("photos", 5), uploadListingPhotos);
router.get("/:id/comments", getCommentsForListing);
router.get("/:id/reviews", getReviewsForListing);
export default router;
