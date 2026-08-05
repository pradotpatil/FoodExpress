import api from "./api";

export const getRecommendations = (restaurantId) => {
  return api.get(
    `/menu/recommendations/${restaurantId}`
  );
};