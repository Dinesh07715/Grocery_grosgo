// src/api/api.js
import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

console.log("🌍 API BASE URL =", BASE_URL);

const API = axios.create({
  // 🔥 OPTION 1: If your backend routes already have /api prefix
  baseURL: BASE_URL,
  
  // 🔥 OPTION 2: If your backend routes DON'T have /api prefix (keep your current setup)
  // baseURL: `${BASE_URL}/api`,
});

/**
 * ================================
 * REQUEST INTERCEPTOR
 * ================================
 */
API.interceptors.request.use(
  (config) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    let token = isAdminRoute
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ================================
 * RESPONSE INTERCEPTOR
 * ================================
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;