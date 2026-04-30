import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const recalculateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratings = stats.length
    ? {
        average: Number(stats[0].average.toFixed(1)),
        count: stats[0].count,
      }
    : {
        average: 0,
        count: 0,
      };

  await Product.findByIdAndUpdate(productId, { ratings });
  return ratings;
};

const findVerifiedOrder = async (userId, productId) => {
  return Order.findOne({
    user: userId,
    orderStatus: { $ne: "cancelled" },
    items: { $elemMatch: { product: productId } },
  }).sort({ createdAt: -1 });
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name image role")
      .sort({ createdAt: -1 });

    const ratings = reviews.length
      ? {
          average:
            Math.round(
              (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
                10,
            ) / 10,
          count: reviews.length,
        }
      : { average: 0, count: 0 };

    res.status(200).json({
      success: true,
      count: reviews.length,
      ratings,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

export const getMyProductReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const review = await Review.findOne({
      product: productId,
      user: req.user._id,
    }).populate("user", "name image role");

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your review",
      error: error.message,
    });
  }
};

export const upsertProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const imageUrls = req.files?.map((file) => file.path) || [];

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

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback note is required",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (!existingReview) {
      const verifiedOrder = await findVerifiedOrder(req.user._id, productId);

      if (!verifiedOrder) {
        return res.status(403).json({
          success: false,
          message: "Only verified purchases can leave reviews for this product",
        });
      }

      const review = await Review.create({
        product: productId,
        user: req.user._id,
        order: verifiedOrder._id,
        rating: numericRating,
        title: title?.trim() || "",
        comment: comment.trim(),
        images: imageUrls.slice(0, 5),
        isVerifiedPurchase: true,
      });

      await review.populate("user", "name image role");
      const ratings = await recalculateProductRatings(productId);

      return res.status(200).json({
        success: true,
        message: "Review created",
        review,
        ratings,
      });
    }

    if (imageUrls.length > 0) {
      existingReview.images = [...existingReview.images, ...imageUrls].slice(
        0,
        5,
      );
    }

    existingReview.rating = numericRating;
    existingReview.title = title?.trim() || existingReview.title;
    existingReview.comment = comment.trim();
    existingReview.isVerifiedPurchase = true;

    const review = await existingReview.save();
    await review.populate("user", "name image role");

    const ratings = await recalculateProductRatings(productId);

    res.status(200).json({
      success: true,
      message: "Review updated",
      review,
      ratings,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = review.product.toString();
    await review.deleteOne();

    const ratings = await recalculateProductRatings(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted",
      ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
