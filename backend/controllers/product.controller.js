import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      ...req.body,
      images: imageUrls,
      thumbnail: imageUrls[0],
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
    const products = await Product.find().populate("vendor", "name email");

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
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "name email",
    );

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

// export const updateProduct = async (req, res) => {
//   try {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (product.vendor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You are not allowed to modify this product",
//       });
//     }

//     let imageUrls = product.images;

//     if (req.files && req.files.length > 0) {
//       imageUrls = req.files.map((file) => file.path);
//     }

//     product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         images: imageUrls,
//         thumbnail: imageUrls[0],
//       },
//       { new: true },
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product updated",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Update failed",
//       error: error.message,
//     });
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
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

    const sizes = req.body.sizes ? req.body.sizes.split(",") : product.sizes;

    const tags = req.body.tags ? req.body.tags.split(",") : product.tags;

    const colors = req.body.colors
      ? JSON.parse(req.body.colors)
      : product.colors;

    delete req.body.imagesToDelete;
    delete req.body.replaceImages;

    const updatedData = {
      ...req.body,
      images: imageUrls,
      thumbnail: imageUrls[0],
      sizes,
      tags,
      colors,
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
