import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  deleteReview,
  getMyProductReview,
  getProductReviews,
  upsertProductReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/me", protect, getMyProductReview);
router.post(
  "/:productId",
  protect,
  upload.array("images", 5),
  upsertProductReview,
);
router.delete("/:reviewId", protect, deleteReview);

export default router;
