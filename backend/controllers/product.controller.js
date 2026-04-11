import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import Category from "../models/Category.js";

export const createProduct = async (req, res) => {
  try {
    const imageUrls = req.files?.map((file) => file.path) || [];

    const {
      title,
      description,
      brand,
      category,
      subCategory,
      sku,
      mfgDate,
      life,
      type,
      unit,
      variants,
      tags,
      additionalInfo,
      isFeatured,
      isAvailable,
    } = req.body;

    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    if (!parsedVariants || parsedVariants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required",
      });
    }

    const labels = parsedVariants.map((v) => v.label);
    if (labels.length !== new Set(labels).size) {
      return res.status(400).json({
        success: false,
        message: "Duplicate variant labels not allowed",
      });
    }

    const product = new Product({
      title,
      description,
      brand,
      category,
      subCategory,
      sku,
      mfgDate,
      life,
      type,
      unit,
      variants: parsedVariants,
      images: imageUrls,
      thumbnail: imageUrls[0],
      tags: tags ? JSON.parse(tags) : [],
      additionalInfo: additionalInfo ? JSON.parse(additionalInfo) : {},
      isFeatured: isFeatured || false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      vendor: req.user._id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name email")
      .populate("category", "name emoji image")
      .populate("subCategory", "name");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name email")
      .populate("category", "name emoji image")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔐 Ownership check
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this product",
      });
    }

    let imageUrls = product.images;

    if (req.body.imagesToDelete) {
      let imagesToDelete = req.body.imagesToDelete;

      if (typeof imagesToDelete === "string") {
        imagesToDelete = imagesToDelete.split(",");
      }

      for (let img of imagesToDelete) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      imageUrls = product.images.filter((img) => !imagesToDelete.includes(img));
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);

      if (req.body.replaceImages === "true") {
        for (let img of product.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }

        imageUrls = newImages;
      } else {
        imageUrls = [...imageUrls, ...newImages];
      }
    }

    let variants = product.variants;

    if (req.body.variants) {
      variants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;

      if (!variants || variants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one variant is required",
        });
      }

      const labels = variants.map((v) => v.label);
      if (labels.length !== new Set(labels).size) {
        return res.status(400).json({
          success: false,
          message: "Duplicate variant labels not allowed",
        });
      }
    }

    const tags = req.body.tags
      ? typeof req.body.tags === "string"
        ? JSON.parse(req.body.tags)
        : req.body.tags
      : product.tags;

    const additionalInfo = req.body.additionalInfo
      ? typeof req.body.additionalInfo === "string"
        ? JSON.parse(req.body.additionalInfo)
        : req.body.additionalInfo
      : product.additionalInfo;

    const updatedData = {
      title: req.body.title ?? product.title,
      description: req.body.description ?? product.description,
      brand: req.body.brand ?? product.brand,
      category: req.body.category ?? product.category,
      subCategory: req.body.subCategory ?? product.subCategory,
      sku: req.body.sku ?? product.sku,
      mfgDate: req.body.mfgDate ?? product.mfgDate,
      life: req.body.life ?? product.life,
      type: req.body.type ?? product.type,
      unit: req.body.unit ?? product.unit,
      variants,
      tags,
      additionalInfo,
      isFeatured:
        req.body.isFeatured !== undefined
          ? req.body.isFeatured
          : product.isFeatured,
      isAvailable:
        req.body.isAvailable !== undefined
          ? req.body.isAvailable
          : product.isAvailable,
      images: imageUrls,
      thumbnail: imageUrls[0],

      vendor: product.vendor,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    for (let img of product.images) {
      const publicId = img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

const getAllSubcategoryIds = (node) => {
  let ids = [node._id]; // ✅ include parent

  node.children.forEach((child) => {
    ids = ids.concat(getAllSubcategoryIds(child));
  });

  return ids;
};

export const getProductsGroupedByCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    const products = await Product.find().populate("subCategory");

    // map for grouping
    const grouped = {};

    categories.forEach((cat) => {
      grouped[cat._id] = {
        categoryId: cat._id,
        categoryName: cat.name,
        products: [],
      };
    });

    const others = {
      categoryId: "others",
      categoryName: "Others",
      products: [],
    };

    products.forEach((product) => {
      const subCat = product.subCategory;

      if (!subCat) {
        others.products.push(product);
        return;
      }

      const key = subCat.parent
        ? subCat.parent.toString()
        : subCat._id.toString();

      if (grouped[key]) {
        grouped[key].products.push(product);
      } else {
        // fallback safety
        others.products.push(product);
      }
    });

    let result = Object.values(grouped).filter((c) => c.products.length > 0);

    if (others.products.length > 0) {
      result = [others, ...result];
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error grouping products" });
  }
};
// customer product listing according to category
export const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("slug: ", slug);

    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // build tree
    const categories = await Category.find({ isActive: true });

    const map = {};
    categories.forEach((cat) => {
      map[cat._id.toString()] = { ...cat.toObject(), children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent && map[cat.parent.toString()]) {
        map[cat.parent.toString()].children.push(map[cat._id.toString()]);
      }
    });

    const selectedNode = map[category._id.toString()];

    const categoryIds = getAllSubcategoryIds(selectedNode);

    console.log("Selected category:", category.name);
    console.log("Selected node:", selectedNode);
    console.log("Category IDs:", categoryIds);

    const products = await Product.find({
      subCategory: { $in: categoryIds },
    });

    console.log("products:", products);
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
