import api from "./api";

export const addToCart = (cartItem) => {
  return api.post("/cart", cartItem);
};

export const getCart = (customerId) => {
  return api.get(`/cart/customer/${customerId}`);
};

export const updateCartItem = (id, cartItem) => {
  return api.put(`/cart/${id}`, cartItem);
};

export const deleteCartItem = (id) => {
  return api.delete(`/cart/${id}`);
};