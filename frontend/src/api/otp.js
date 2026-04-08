import API from "./axios";

export const sendOtp = (email) => {
  return API.post("/auth/send-otp", { email });
};

export const verifyOtp = (email, otp) => {
  return API.post("/auth/verify-otp", { email, otp });
};
