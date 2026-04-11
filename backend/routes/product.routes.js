import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductByCategory,
  getProducts,
  getProductsGroupedByCategory,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// customer producy list route by category
router.get("/category/:slug", protect, getProductByCategory);

router.get("/grouped-by-category", protect, getProductsGroupedByCategory);

router.post(
  "/",
  protect,
  authorizeRoles("vendor"),
  upload.array("images", 5),
  createProduct,
);

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.put(
  "/:id",
  protect,
  authorizeRoles("vendor"),
  upload.array("images", 5),
  updateProduct,
);

router.delete("/:id", protect, authorizeRoles("vendor"), deleteProduct);

export default router;
