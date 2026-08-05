import api from "./api";

export const addReview = (reviewData) => {
  return api.post("/reviews", reviewData);
};

export const getAllReviews = () => {
  return api.get("/reviews");
};

export const getRestaurantReviews = (restaurantId) => {
  return api.get(`/reviews/restaurant/${restaurantId}`);
};

export const getCustomerReviews = (customerId) => {
  return api.get(`/reviews/customer/${customerId}`);
};

export const deleteReview = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};