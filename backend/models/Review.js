import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 400,
    },
    images: [
      {
        type: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
