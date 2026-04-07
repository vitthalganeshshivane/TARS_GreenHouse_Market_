import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["customer", "vendor"],
      default: "customer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    addresses: [
      {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
