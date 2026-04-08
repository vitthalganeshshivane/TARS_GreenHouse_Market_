import Address from "../models/Address";
import User from "../models/User";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
      },
      { new: true },
    ).select("-password");

    res.json(updated);
  } catch (error) {
    console.log("Error in Updating Profile:", error.message);
  }
};

export const addAdress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, addressLine, city, state, pincode } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const existing = await Address.find({ user: userId });

    let isDefault = false;
    if (existing.length === 0) {
      isDefault = true;
    }

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // remove old default
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });

    const updated = await Address.updateOne(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findByIdAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.isDefault) {
      const another = await Address.findOne({ user: userId });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatedAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const updated = await Address.findByIdAndUpdate(
      { _id: addressId, user: userId },
      req.body,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
