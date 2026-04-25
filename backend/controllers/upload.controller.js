import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl,
      public_id: publicId,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
