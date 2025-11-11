// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your Django API base URL
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log(token);
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (err) {
          console.error("Token refresh failed:", err);
          window.location.href = "/login"; // logout user
        }
      }
    }
    return Promise.reject(error);
  }
);
export default api;