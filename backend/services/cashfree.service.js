import axios from "axios";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg");

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2025-01-01";

const getCashfreeHeaders = () => {
  if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
    throw new Error(
      "Cashfree credentials are missing. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET in backend .env",
    );
  }

  return {
    "Content-Type": "application/json",
    "x-client-id": CASHFREE_CLIENT_ID,
    "x-client-secret": CASHFREE_CLIENT_SECRET,
    "x-api-version": CASHFREE_API_VERSION,
  };
};

export const createCashfreeOrder = async ({
  orderId,
  amount,
  customer,
  returnUrl,
}) => {
  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer.customer_id,
      customer_name: customer.customer_name,
      customer_email: customer.customer_email,
      customer_phone: customer.customer_phone,
    },
    order_meta: {
      return_url: returnUrl,
    },
  };

  try {
    const res = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
      headers: getCashfreeHeaders(),
    });

    return res.data;
  } catch (error) {
    console.log(
      "Cashfree create order error:",
      error.response?.status,
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.type ||
        "Failed to create Cashfree order",
    );
  }
};

export const getCashfreePaymentsByOrderId = async (cashfreeOrderId) => {
  try {
    const res = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${cashfreeOrderId}/payments`,
      {
        headers: getCashfreeHeaders(),
      },
    );

    return res.data;
  } catch (error) {
    console.log(
      "Cashfree verify payment error:",
      error.response?.status,
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.type ||
        "Failed to fetch Cashfree payment status",
    );
  }
};
