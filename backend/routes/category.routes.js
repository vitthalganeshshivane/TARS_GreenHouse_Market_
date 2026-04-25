import express from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  getCategoryTree,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// customer api
router.get("/tree", getCategoryTree);
router.get("/slug/:slug", getCategoryBySlug);

router.post(
  "/",
  protect,
  authorizeRoles("vendor"),
  upload.single("image"),
  createCategory,
);

router.get("/", protect, authorizeRoles("vendor"), getCategories);

router.get("/:id", protect, authorizeRoles("vendor"), getSingleCategory);

router.put(
  "/:id",
  protect,
  authorizeRoles("vendor"),
  upload.single("image"),
  updateCategory,
);

router.delete("/:id", protect, authorizeRoles("vendor"), deleteCategory);

export default router;
