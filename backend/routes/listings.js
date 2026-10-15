import express from "express";
import { upload } from "../middleware/mutler.js";
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
} from "../middleware/listingValidations.js";

const router = express.Router();

router.post("/", validateListing, createListing);
router.get("/", validatePage, getListings);
router.get("/:id", getListingById);
router.post("/:id/photos", upload.array("photos", 5), uploadListingPhotos);
router.get("/:id/comments", getCommentsForListing);
router.get("/:id/reviews", getReviewsForListing);
router.patch("/:id", validateUpdateListing, updateListing);
router.delete("/:id", deleteListing);
export default router;
