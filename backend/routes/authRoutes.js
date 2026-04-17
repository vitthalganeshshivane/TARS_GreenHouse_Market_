import express from "express";
import {
  forgotPassword,
  getMe,
  login,
  resetPassword,
  sendOtpController,
  signup,
  verifyOtpController,
} from "../controllers/authControllers.js";
const router = express.Router();
import { protect } from "../middleware/auth.middleware.js";

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
