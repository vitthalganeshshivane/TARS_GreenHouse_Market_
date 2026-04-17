import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createCashfreePaymentSession,
  verifyPaymentStatus,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-session", protect, createCashfreePaymentSession);
router.get("/verify/:orderId", protect, verifyPaymentStatus);

export default router;
