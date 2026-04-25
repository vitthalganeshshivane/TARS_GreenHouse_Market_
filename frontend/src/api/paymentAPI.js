import API from "./axios";

export const createPaymentSessionApi = (payload) => {
  return API.post("/payments/create-session", payload);
};

export const verifyPaymentStatusApi = (orderId) => {
  return API.get(`/payments/verify/${orderId}`);
};
