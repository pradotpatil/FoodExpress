import api from "./api";

export const addFavorite = (favoriteData) => {
  return api.post("/favorites", favoriteData);
};

export const getCustomerFavorites = (customerId) => {
  return api.get(`/favorites/customer/${customerId}`);
};

export const checkFavorite = (
  customerId,
  restaurantId
) => {
  return api.get(
    `/favorites/customer/${customerId}/restaurant/${restaurantId}`
  );
};

export const removeFavorite = (
  customerId,
  restaurantId
) => {
  return api.delete(
    `/favorites/customer/${customerId}/restaurant/${restaurantId}`
  );
};