import API from './api/api'
import { getApiUrl, API_ENDPOINTS } from '../config/api'

export const orderService = {
  // Get all orders
  getOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ORDERS)
    return response.data
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(getApiUrl(API_ENDPOINTS.ORDER_DETAIL, { id: orderId }))
    return response.data
  },

  // Place order
  placeOrder: async (orderData) => {
    const response = await API.post(API_ENDPOINTS.PLACE_ORDER, orderData)
    return response.data
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await API.post(getApiUrl(API_ENDPOINTS.CANCEL_ORDER, { id: orderId }))
    return response.data
  },

  // Reorder
  reorder: async (orderId) => {
    const response = await API.post(getApiUrl(API_ENDPOINTS.REORDER, { id: orderId }))
    return response.data
  },
}


