import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD", "NETBANKING", "WALLET"],
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "initiated", "success", "failed"],
      default: "pending",
    },
    provider: {
      type: String,
      default: "cashfree",
    },

    cashfreeOrderId: String,
    paymentSessionId: String,
    cfPaymentId: String,
    transactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    failureReason: String,
    paidAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
