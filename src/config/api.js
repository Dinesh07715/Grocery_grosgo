// src/config/config.js

/**
 * ================================
 * ENVIRONMENT BASE URL
 * ================================
 * Netlify  → uses VITE_API_BASE_URL
 * Local    → fallback to localhost
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : 'http://localhost:8080/api'

/**
 * ================================
 * DEMO MODE (optional)
 * ================================
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

/**
 * ================================
 * API ENDPOINTS
 * ================================
 * Do NOT include /api here (it's already in BASE_URL)
 */
export const API_ENDPOINTS = {
  // 🔐 AUTH
  LOGIN: '/users/login',
  REGISTER: '/users/register',

  // 👤 USER
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',

  // 🥬 PRODUCTS / FOODS
  FOODS: '/foods',
  PRODUCTS: '/foods',  // Alias for FOODS
  FOOD_DETAIL: '/foods/:id',
  PRODUCT_DETAIL: '/foods/:id',  // Alias for FOOD_DETAIL
  FOODS_BY_CATEGORY: '/foods/category/:category',
  PRODUCTS_BY_CATEGORY: '/foods/category/:category',  // Alias
  SEARCH: '/foods/search',

  // 🛒 CART
  CART: '/cart/my',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update/:id',
  REMOVE_FROM_CART: '/cart/remove/:id',
  CLEAR_CART: '/cart/clear',

  // 📦 ORDERS
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PLACE_ORDER: '/orders/place',
  MY_ORDERS: '/orders/my',

  // 💳 PAYMENT
  PAYMENT_INITIATE: '/payment/initiate',
  PAYMENT_COMPLETE: '/payment/complete',

  // 🖼️ IMAGES
  UPLOADS: '/uploads',
  
  // 📂 CATEGORIES & BANNERS (if needed)
  CATEGORIES: '/categories',
  BANNERS: '/banners',
}

/**
 * ================================
 * URL BUILDER
 * ================================
 */
export const getApiUrl = (endpoint, params = {}) => {
  let url = endpoint

  // Replace :param with actual values
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key])
  })

  return url
}