import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, emoji } = req.body;

    const image = req.file?.path || null;

    const existing = await Category.findOne({
      name,
      vendor: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Category({
      name,
      description,
      parent: parent || null,
      emoji,
      image,
      vendor: req.user._id,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      vendor: req.user._id,
    }).populate("parent", "name");

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent",
      "name",
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔐 Ownership check
    if (category.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, description, parent, emoji, isActive, removeImage } =
      req.body;

    const image = req.file?.path;

    const updatedData = {
      name: name ?? category.name,
      description: description ?? category.description,
      parent: parent !== undefined ? parent : category.parent,
      emoji: emoji ?? category.emoji,
      isActive: isActive !== undefined ? isActive : category.isActive,
      image: removeImage === "true" ? null : (image ?? category.image),
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔐 Ownership check
    if (category.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ❗ Check if category is used in products
    const hasProducts = await Product.exists({
      $or: [{ category: category._id }, { subCategory: category._id }],
    });

    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category linked to products",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};
