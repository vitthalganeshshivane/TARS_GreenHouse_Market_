import axios from "axios";

const CASHFREE_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

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

  const res = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2025-01-01",
    },
  });

  return res.data;
};

export const getCashfreePaymentsByOrderId = async (cashfreeOrderId) => {
  const res = await axios.get(
    `${CASHFREE_BASE_URL}/orders/${cashfreeOrderId}/payments`,
    {
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2025-01-01",
      },
    },
  );

  return res.data;
};
