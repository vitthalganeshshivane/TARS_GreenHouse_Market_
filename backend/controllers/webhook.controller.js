import crypto from "crypto";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Notification from "../models/Notification.js";

const verifyCashfreeSignature = (rawBody, signature, timestamp) => {
  const signedPayload = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
    .update(signedPayload)
    .digest("base64");

  return expectedSignature === signature;
};

export const cashfreeWebhook = async (req, res) => {
  try {
    const rawBody = req.body.toString("utf8");
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!verifyCashfreeSignature(rawBody, signature, timestamp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = JSON.parse(rawBody);

    const cashfreeOrderId = payload?.data?.order?.order_id;
    const cfPaymentId = payload?.data?.payment?.cf_payment_id;
    const paymentStatus = payload?.data?.payment?.payment_status;

    const payment = await Payment.findOne({
      cashfreeOrderId: payload?.data?.cf_payment?.order_id || null,
    });

    const paymentDoc = await Payment.findOne({
      cfPaymentId,
    }).populate("order");

    let paymentRecord =
      paymentDoc ||
      (await Payment.findOne({ cashfreeOrderId }).populate("order"));

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const order = await Order.findById(paymentRecord.order._id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (paymentStatus === "SUCCESS") {
      if (paymentRecord.paymentStatus === "success") {
        return res
          .status(200)
          .json({ success: true, message: "Already handled" });
      }

      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product) continue;

        const selectedVariant = product.variants.find(
          (v) => v.label === item.variant,
        );

        if (!selectedVariant || selectedVariant.stock < item.quantity) {
          order.paymentStatus = "failed";
          order.orderStatus = "cancelled";
          paymentRecord.paymentStatus = "failed";
          paymentRecord.failureReason = "Stock unavailable at confirmation";
          await order.save();
          await paymentRecord.save();

          return res.status(200).json({
            success: true,
            message: "Payment received but stock unavailable",
          });
        }
      }

      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        const selectedVariant = product.variants.find(
          (v) => v.label === item.variant,
        );

        if (selectedVariant) {
          selectedVariant.stock -= item.quantity;
          await product.save();
        }
      }

      paymentRecord.paymentStatus = "success";
      paymentRecord.cfPaymentId = cfPaymentId;
      paymentRecord.transactionId = cfPaymentId;
      paymentRecord.gatewayResponse = payload;
      paymentRecord.paidAt = new Date();

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";

      await paymentRecord.save();
      await order.save();

      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalAmount: 0 },
      );

      await Notification.create({
        user: order.vendor,
        type: "order",
        title: "New Paid Order Received",
        message: `New prepaid order placed for ₹${order.totalAmount}`,
        referenceId: order._id,
        referenceType: "Order",
      });
    }

    if (paymentStatus === "FAILED") {
      paymentRecord.paymentStatus = "failed";
      paymentRecord.cfPaymentId = cfPaymentId;
      paymentRecord.gatewayResponse = payload;
      paymentRecord.failureReason =
        payload?.data?.payment?.payment_message || "Payment failed";

      order.paymentStatus = "failed";
      order.orderStatus = "payment_pending";

      await paymentRecord.save();
      await order.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Webhook failed",
    });
  }
};
