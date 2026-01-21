// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'


export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'



export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Location & Address
  LOCATIONS: '/locations',
  ADDRESSES: '/addresses',
  SAVE_ADDRESS: '/addresses',
  DELETE_ADDRESS: '/addresses/:id',
  SERVICEABILITY: '/locations/serviceability',
  
  // Products
  PRODUCTS: '/foods',
  PRODUCT_DETAIL: '/foods/:id',
  PRODUCTS_BY_CATEGORY: '/foods/category/:category',
  SEARCH: '/foods/search',
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update/:id',
  REMOVE_FROM_CART: '/cart/remove/:id',
  CLEAR_CART: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PLACE_ORDER: '/orders/place',
  CANCEL_ORDER: '/orders/:id/cancel',
  REORDER: '/orders/:id/reorder',
  
  // Coupons
  COUPONS: '/coupons',
  APPLY_COUPON: '/coupons/apply',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Banners
  BANNERS: '/banners',
}

export const getApiUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key])
  })
  return url
}


