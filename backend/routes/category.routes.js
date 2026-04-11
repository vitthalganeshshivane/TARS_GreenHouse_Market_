import express from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("vendor"),
  upload.single("image"),
  createCategory,
);

router.get("/", getCategories);

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
