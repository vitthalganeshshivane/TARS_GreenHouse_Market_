import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

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
