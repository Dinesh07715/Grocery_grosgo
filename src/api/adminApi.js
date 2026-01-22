import axios from "axios";


const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
/**
 * ======================================
 * JWT DECODER (NO DEPENDENCY)
 * ======================================
 */
const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * ======================================
 * ADMIN AXIOS INSTANCE (ISOLATED)
 * ======================================
 */
const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ======================================
 * REQUEST INTERCEPTOR
 * ======================================
 */
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");

    // 🚫 Skip auth check on admin login page
    if (window.location.pathname === "/admin/login") {
      return config;
    }

    // ❌ No token
    if (!adminToken) {
      console.warn("⚠️ ADMIN TOKEN MISSING");
      return Promise.reject("No admin token");
    }

    const decoded = decodeJwt(adminToken);

    // ❌ Invalid token
    if (!decoded) {
      console.error("❌ INVALID ADMIN TOKEN");
      localStorage.removeItem("adminToken");
      return Promise.reject("Invalid token");
    }

    // ❌ Role mismatch
    if (decoded.role !== "ADMIN") {
      console.error("🚫 NON-ADMIN TOKEN BLOCKED");
      localStorage.removeItem("adminToken");
      return Promise.reject("Role mismatch");
    }

    // ✅ Attach token
    config.headers.Authorization = `Bearer ${adminToken}`;
    console.log("🔐 ADMIN TOKEN ATTACHED");

    return config;
  },
  (error) => {
    console.error("❌ ADMIN REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

/**
 * ======================================
 * RESPONSE INTERCEPTOR
 * ======================================
 */
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    console.error("❌ ADMIN API ERROR:", status);

    // 🔒 Session expired
    if (status === 401) {
      console.warn("🚪 ADMIN SESSION EXPIRED");
      localStorage.removeItem("adminToken");

      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
