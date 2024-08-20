import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  getAllReviews
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.delete("/:id", verifyToken, deleteReview);
router.get("/:productId", getReviews);
router.get("/", verifyToken, getAllReviews);

export default router;