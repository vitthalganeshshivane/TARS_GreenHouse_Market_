import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Payment from "../models/Payment.js";
import Counter from "../models/Counter.js";
import { createCashfreeOrder } from "./cashfree.service.js";

const generateOrderId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true },
  );

  return `ORD-${counter.value.toString().padStart(6, "0")}`;
};

export const createPendingOrderAndPayment = async ({
  user,
  shippingAddress,
}) => {
  const address = await Address.findById(shippingAddress);
  if (!address) {
    throw new Error("Invalid address");
  }

  const cart = await Cart.findOne({ user: user._id }).populate("items.product");
  if (!cart || !cart.items.length) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;
  let vendorId = null;
  let orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product) throw new Error("Product not found");

    const selectedVariant = product.variants.find(
      (v) => v.label === item.variant.label,
    );

    if (!selectedVariant) {
      throw new Error(`Variant ${item.variant.label} not found`);
    }

    if (selectedVariant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.title}`);
    }

    const price = selectedVariant.discountPrice || selectedVariant.price;
    totalAmount += price * item.quantity;

    orderItems.push({
      product: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      variant: item.variant.label,
      quantity: item.quantity,
      price,
    });

    vendorId = product.vendor;
  }

  const customOrderId = await generateOrderId();

  const order = await Order.create({
    orderId: customOrderId,
    user: user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: "ONLINE",
    paymentStatus: "pending",
    orderStatus: "payment_pending",
    vendor: vendorId,
  });

  const cashfreeOrder = await createCashfreeOrder({
    orderId: customOrderId,
    amount: totalAmount,
    customer: {
      customer_id: user._id.toString(),
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone || "9999999999",
    },
    returnUrl: `${process.env.CLIENT_URL}/payment-status?order_id=${customOrderId}`,
  });

  const payment = await Payment.create({
    user: user._id,
    order: order._id,
    amount: totalAmount,
    paymentMethod: "UPI",
    paymentStatus: "initiated",
    cashfreeOrderId: cashfreeOrder.cf_order_id,
    paymentSessionId: cashfreeOrder.payment_session_id,
    gatewayResponse: cashfreeOrder,
  });

  return {
    order,
    payment,
    cashfreeOrder,
  };
};
