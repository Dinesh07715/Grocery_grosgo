// src/api/api.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
console.log("🌍 API BASE URL =", import.meta.env.VITE_API_BASE_URL);


/**
 * ================================
 * REQUEST INTERCEPTOR
 * ================================
 * Determines which token to use based on:
 * 1. Custom header if specified
 * 2. Current route (/admin/* vs others)
 * 3. Which tokens are available
 */
API.interceptors.request.use(
  (config) => {
    // Allow manual token specification via custom header
    if (config.headers['X-Use-Token']) {
      const tokenType = config.headers['X-Use-Token'];
      delete config.headers['X-Use-Token']; // Remove custom header
      
      if (tokenType === 'admin') {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
          console.log("🔑 Admin token attached (manual)");
        }
        return config;
      } else if (tokenType === 'user') {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
          console.log("🔑 User token attached (manual)");
        }
        return config;
      }
    }

    // Auto-detect based on route
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    let token = null;

    if (isAdminRoute) {
      // ✅ ADMIN ROUTE - Use adminToken
      token = localStorage.getItem("adminToken");
      if (token) {
        console.log("🔑 Admin token attached (auto)");
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // ✅ USER ROUTE - Use userToken
      token = localStorage.getItem("userToken");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expiryTime = new Date(payload.exp * 1000);
          const now = new Date();
          const timeLeft = Math.round((expiryTime - now) / 60000);

          console.log(
            "🔑 User token attached (auto) | Expires:",
            expiryTime.toLocaleString(),
            `| Time left: ${timeLeft} mins`
          );

          if (timeLeft < 0) {
            console.warn("⚠️ User token expired");
            localStorage.removeItem("userToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(new Error("User token expired"));
          }
          
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.log("🔑 User token decode failed", error);
          // Clear invalid token
          localStorage.removeItem("userToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(new Error("Invalid user token"));
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
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
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    console.error("❌ API Error:", status, error.response?.data);

    // 🔓 UNAUTHORIZED
    if (status === 401) {
      if (isAdminRoute) {
        console.warn("🚪 Admin session expired");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      } else {
        console.warn("🚪 User session expired");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // 🚫 FORBIDDEN
    if (status === 403) {
      console.warn("🚫 Access forbidden");
      // Don't clear tokens on 403 - might be accessing wrong endpoint
    }

    return Promise.reject(error);
  }
);

// Export both named and default
export const api = API;
export default API;