import express from "express";
import {
  getMe,
  login,
  sendOtpController,
  signup,
  verifyOtpController,
} from "../controllers/authControllers.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, getMe);

export default router;
