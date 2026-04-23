import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Notification from "../models/Notification.js";
import Counter from "../models/Counter.js";
import Cart from "../models/Cart.js";

const generateOrderId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true },
  );

  return `ORD-${counter.value.toString().padStart(6, "0")}`;
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    // ✅ Validate address
    const address = await Address.findById(shippingAddress);
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Invalid address",
      });
    }

    let totalAmount = 0;
    const orderItems = [];
    let vendorId = null;

    const customOrderId = await generateOrderId();

    for (let item of items) {
      const { productId, variant, quantity } = item;

      const product = await Product.findById(productId);
      // console.log("product on order craetion:", product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // 🔍 Find variant
      const selectedVariant = product.variants.find((v) => v.label === variant);

      if (!selectedVariant) {
        return res.status(400).json({
          success: false,
          message: `Variant ${variant} not found`,
        });
      }

      // ❌ Check stock
      if (selectedVariant.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`,
        });
      }

      // 💰 Price logic
      const price = selectedVariant.discountPrice || selectedVariant.price;

      totalAmount += price * quantity;

      // 🧾 Snapshot
      orderItems.push({
        product: product._id,
        title: product.title,
        thumbnail: product.thumbnail,
        variant,
        quantity,
        price,
      });

      // 📦 Reduce stock
      selectedVariant.stock -= quantity;

      // 🔔 LOW STOCK NOTIFICATION
      if (selectedVariant.stock < 5) {
        await Notification.create({
          user: product.vendor,
          type: "stock",
          title: "Low Stock Alert",
          message: `${product.title} (${variant}) is low in stock`,
          referenceId: product._id,
          referenceType: "Product",
        });
      }

      await product.save();

      // 🏪 Set vendor (single vendor assumption)
      vendorId = product.vendor;
    }

    const order = new Order({
      orderId: customOrderId,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      vendor: vendorId,
    });

    await order.save({ validateBeforeSave: false });

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 },
    );

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 },
    );

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 },
    );

    // 🔔 NEW ORDER NOTIFICATION
    await Notification.create({
      user: vendorId,
      type: "order",
      title: "New Order Received",
      message: `New order placed for ₹${totalAmount}`,
      referenceId: order._id,
      referenceType: "Order",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Error in Order Creation:", error.message);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("shippingAddress")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 Access control
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      order.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id })
      .populate("user", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 Vendor check
    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};
