import api from "./api";

export const createPaymentOrder = (amount) => {
  return api.post("/payments/create-order", {
    amount,
  });
};

export const verifyPayment = (paymentData) => {
  return api.post("/payments/verify", paymentData);
};