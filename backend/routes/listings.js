import express from "express";
import { upload } from "../middleware/multer.js";
import {
  createListing,
  getListings,
  getListingById,
  uploadListingPhotos,
  getCommentsForListing,
  getReviewsForListing,
  updateListing,
  deleteListing,
} from "../controllers/listingsController.js";

import {
  validateUpdateListing,
  validateListing,
  validatePage,
  validateId,
} from "../middleware/listingValidations.js";
import { ensureListingExists } from "../middleware/ensureListingExists.js";
import { validateUploadedImages } from "../middleware/validateUploadedImages.js";

const router = express.Router();

router.post("/", validateListing, createListing);
router.get("/", validatePage, getListings);
router.get("/:id", validateId, getListingById);
router.post(
  "/:id/photos",
  validateId,
  ensureListingExists,
  upload.array("photos", 5),
  validateUploadedImages,
  uploadListingPhotos,
);
router.get("/:id/comments", validateId, getCommentsForListing);
router.get("/:id/reviews", validateId, getReviewsForListing);
router.patch("/:id", validateId, validateUpdateListing, updateListing);
router.delete("/:id", validateId, deleteListing);

export default router;
