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
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    image: String,

    role: {
      type: String,
      enum: ["customer", "vendor"],
      default: "customer",
    },

    store: {
      storeName: { type: String, default: "" },
      gstNumber: { type: String, default: "" },
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      pincode: { type: String, default: "" },
      openTime: { type: String, default: "" },
      closeTime: { type: String, default: "" },
      deliveryRadius: { type: Number, default: 0 },
      minOrderAmount: { type: Number, default: 0 },
      freeDeliveryAbove: { type: Number, default: 0 },
    },

    notificationPreferences: {
      newOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      payment: { type: Boolean, default: true },
      delivery: { type: Boolean, default: false },
      weeklyReport: { type: Boolean, default: true },
      promotional: { type: Boolean, default: false },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
