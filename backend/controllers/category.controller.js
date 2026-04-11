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

// customer api
export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat._id] = { ...cat.toObject(), children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    const countChildren = (node) => {
      let count = 0;

      node.children.forEach((child) => {
        count += 1;
        count += countChildren(child);
      });

      return count;
    };

    Object.values(map).forEach((cat) => {
      cat.totalSubcategories = countChildren(cat);
    });

    res.json({
      success: true,
      categories: roots,
    });
  } catch (error) {
    console.log("Error i get categorie:", error.message);
    res.status(500).json({
      success: false,
      message: "Tree fetch failed",
      error: error.message,
    });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      slug,
      isActive: true,
    }).populate("parent", "name slug");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};
