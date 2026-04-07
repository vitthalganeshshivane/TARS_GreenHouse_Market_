import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    category: String,

    stock: {
      type: Number,
      required: true,
    },

    images: [String],

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
