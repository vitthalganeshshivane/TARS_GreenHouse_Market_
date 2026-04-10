import express from "express";
import {
  getVendorProfile,
  updateVendorProfile,
  updateStoreDetails,
} from "../controllers/vendor.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/me", protect, authorizeRoles("vendor"), getVendorProfile);

router.put(
  "/profile",
  protect,
  authorizeRoles("vendor"),
  upload.single("image"),
  updateVendorProfile,
);

router.put("/store", protect, authorizeRoles("vendor"), updateStoreDetails);

export default router;
