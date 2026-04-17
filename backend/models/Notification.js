import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["order", "stock", "payment", "delivery", "system"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    referenceType: {
      type: String,
      enum: ["Order", "Product"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
