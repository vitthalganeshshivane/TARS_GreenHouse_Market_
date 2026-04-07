import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },

  otp: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  expiresAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000,
    index: { expires: 0 },
  },
});

export default mongoose.model("OTP", otpSchema);
