import axios from "axios";

const api = axios.create({
  baseURL: "https://foodexpress-qb0c.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;