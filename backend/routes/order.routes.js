import express from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.get("/vendor", protect, authorizeRoles("vendor"), getVendorOrders);

router.get("/:id", protect, getSingleOrder);

router.put("/:id/status", protect, authorizeRoles("vendor"), updateOrderStatus);

export default router;
