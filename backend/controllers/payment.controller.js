import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { createPendingOrderAndPayment } from "../services/payment.service.js";
import { getCashfreePaymentsByOrderId } from "../services/cashfree.service.js";

export const createCashfreePaymentSession = async (req, res) => {
  // console.log("payment session hiiting api");
  try {
    const { shippingAddress } = req.body;

    const result = await createPendingOrderAndPayment({
      user: req.user,
      shippingAddress,
    });

    res.status(200).json({
      success: true,
      message: "Payment session created",
      data: {
        orderId: result.order._id,
        orderCode: result.order.orderId,
        paymentSessionId: result.cashfreeOrder.payment_session_id,
        cashfreeOrderId: result.cashfreeOrder.cf_order_id,
        amount: result.order.totalAmount,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment session",
    });
  }
};

export const verifyPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // console.log("verify orderId from params:", orderId);
    // console.log("verify req.user:", req.user);
    const order = await Order.findOne({
      orderId,
      user: req.user._id,
    });

    // console.log("found order:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payment = await Payment.findOne({ order: order._id });
    // console.log("found payment:", payment);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // console.log("cashfreeOrderId:", payment.cashfreeOrderId);

    const cashfreePayments = await getCashfreePaymentsByOrderId(order.orderId);

    // console.log("cashfreePayments:", cashfreePayments);

    const successfulPayment = cashfreePayments.find(
      (item) => item.payment_status === "SUCCESS",
    );

    if (successfulPayment && order.paymentStatus !== "paid") {
      payment.paymentStatus = "success";
      payment.cfPaymentId = successfulPayment.cf_payment_id;
      payment.transactionId = successfulPayment.cf_payment_id;
      payment.paidAt = new Date(successfulPayment.payment_completion_time);
      payment.gatewayResponse = successfulPayment;

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";

      await payment.save();
      await order.save();
    }

    const updatedOrder = await Order.findById(order._id);
    const updatedPayment = await Payment.findById(payment._id);
    res.status(200).json({
      success: true,
      order: updatedOrder,
      payment: updatedPayment,
      cashfreePayments,
    });
  } catch (error) {
    console.log("Verify payment error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};
