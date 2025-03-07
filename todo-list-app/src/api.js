import axios from "axios";

const api = axios.create({
  baseURL: "https://wep-app.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо accessToken до заголовків
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обробка 401 помилок і оновлення токена
let isRefreshing = false;
let refreshSubscribers = [];

const processQueue = (error, token = null) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("No refresh token available");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${api.defaults.baseURL}/api/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );
          const { access } = response.data;
          localStorage.setItem("accessToken", access);
          processQueue(null, access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Якщо оновлення вже в процесі, додаємо запит у чергу
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
