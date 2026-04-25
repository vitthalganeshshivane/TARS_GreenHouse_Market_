import express from "express";
import { cashfreeWebhook } from "../controllers/webhook.controller.js";
const router = express.Router();

// IMPORTANT: raw body for signature validation
router.post(
  "/cashfree",
  express.raw({ type: "application/json" }),
  cashfreeWebhook,
);

export default router;
