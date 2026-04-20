import mongoose from "mongoose";
import Product from "../models/Product.js";
import Wishlist from "../models/WishList.js";

const populateWishlist = async (wishlist) => {
  if (!wishlist) return null;

  await wishlist.populate({
    path: "products",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  return wishlist;
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  return populateWishlist(wishlist);
};

export const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const wishlist = await getOrCreateWishlist(req.user._id);

    const exists = wishlist.products.some(
      (item) => item._id.toString() === productId,
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await populateWishlist(wishlist);

    return res.status(200).json({
      success: true,
      message: exists ? "Already in wishlist" : "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const wishlist = await getOrCreateWishlist(req.user._id);

    wishlist.products = wishlist.products.filter(
      (item) => item._id.toString() !== productId,
    );

    await wishlist.save();
    await populateWishlist(wishlist);

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message,
    });
  }
};
