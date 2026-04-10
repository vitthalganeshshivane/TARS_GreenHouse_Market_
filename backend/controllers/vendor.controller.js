import User from "../models/User.js";

export const getVendorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const image = req.file?.path;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.image = image ?? user.image;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};

export const updateStoreDetails = async (req, res) => {
  try {
    const {
      storeName,
      gstNumber,
      storeAddress,
      pincode,
      openTime,
      closeTime,
      deliveryRadius,
      minOrderAmount,
      freeDeliveryAbove,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.store) {
      user.store = {};
    }

    user.store = {
      ...user.store,
      storeName: storeName ?? user.store.storeName,
      gstNumber: gstNumber ?? user.store.gstNumber,
      storeAddress: storeAddress ?? user.store.storeAddress,
      pincode: pincode ?? user.store.pincode,
      openTime: openTime ?? user.store.openTime,
      closeTime: closeTime ?? user.store.closeTime,
      deliveryRadius: deliveryRadius ?? user.store.deliveryRadius,
      minOrderAmount: minOrderAmount ?? user.store.minOrderAmount,
      freeDeliveryAbove: freeDeliveryAbove ?? user.store.freeDeliveryAbove,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Store details updated successfully",
      store: user.store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Store update failed",
      error: error.message,
    });
  }
};
