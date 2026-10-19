import express from "express";
import { search } from "../controllers/searchController.js";
import { validateSearchQuery } from "../middleware/listingValidations.js";

const router = express.Router();

router.get("/", validateSearchQuery, search);

export default router;
