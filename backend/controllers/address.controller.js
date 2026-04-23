import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  try {
    // console.log("creating address api hit");
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    const userId = req.user._id;

    const { fullName, addressLine, city, state, pincode, location, isDefault } =
      req.body;

    if (!fullName || !addressLine || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "fullName, addressLine, city and state are required",
      });
    }

    if (isDefault === true || isDefault === "true") {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } },
      );
    }

    const address = await Address.create({
      user: userId,
      fullName,
      addressLine,
      city,
      state,
      pincode,
      location: location || undefined,
      isDefault: isDefault === true || isDefault === "true",
    });

    // console.log("address:", address);

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.log("Error in creating adress:", error.message);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });

    // console.log("All Address:", addresses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

export const getSingleAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, addressLine, city, state, pincode, location, isDefault } =
      req.body;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (isDefault === true || isDefault === "true") {
      await Address.updateMany(
        { user: userId, _id: { $ne: address._id } },
        { $set: { isDefault: false } },
      );
      address.isDefault = true;
    } else if (isDefault === false || isDefault === "false") {
      address.isDefault = false;
    }

    address.fullName = fullName ?? address.fullName;
    address.addressLine = addressLine ?? address.addressLine;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.location = location ?? address.location;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    if (wasDefault) {
      const nextAddress = await Address.findOne({ user: userId }).sort({
        createdAt: -1,
      });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const address = await Address.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};
