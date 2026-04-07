import express from "express";
import {
  login,
  sendOtpController,
  signup,
  verifyOtpController,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

router.post("/signup", signup);
router.post("/login", login);

export default router;
