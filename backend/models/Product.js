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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

    variants: {
      type: [
        {
          label: {
            type: String,
            required: true,
          },
          discountPrice: Number,
          price: {
            type: Number,
            required: true,
          },
          stock: {
            type: Number,
            default: 0,
          },
          sku: String,
        },
      ],
      validate: [(arr) => arr.length > 0, "At least one variant is required"],
    },

    unit: {
      type: String, // "kg", "litre", "piece"
      required: true,
    },

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
