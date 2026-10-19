import express from "express";
import { getUser } from "../controllers/usersController.js";
import { validateId } from "../middleware/listingValidations.js";
const router = express.Router();

router.get("/:id", validateId, getUser);

export default router;
