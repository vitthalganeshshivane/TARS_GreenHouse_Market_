import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    brand: {
      type: String, // Seeds of Change
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: String,

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    // Stock Keeping Unit
    // --> It’s a unique identifier for each product
    // Example:
    // RICE-ORG-1KG-001
    // MILK-AMUL-500ML-002

    sku: {
      type: String,
      unique: true,
    },

    mfgDate: Date,

    life: {
      type: Number, // 70 days
    },

    type: {
      type: String, // Organic
    },

    images: [String],

    thumbnail: String,

    sizes: [String], // 50g, 60g etc.

    colors: [
      {
        name: String,
        stock: Number,
      },
    ],

    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    tags: [String],

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    additionalInfo: {
      packaging: String,
      ingredients: String,
      warnings: String,
      suggestedUse: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
