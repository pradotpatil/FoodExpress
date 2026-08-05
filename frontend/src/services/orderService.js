import api from "./api";

export const placeOrder = (order) => {
  return api.post("/orders", order);
};

export const getCustomerOrders = (customerId) => {
  return api.get(`/orders/customer/${customerId}`);
};

export const getAllOrders = () => {
  return api.get("/orders");
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrder = (id, order) => {
  return api.put(`/orders/${id}`, order);
};

export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, status, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export const deleteOrder = (id) => {
  return api.delete(`/orders/${id}`);
};