import API from '../api/api'
import { getApiUrl, API_ENDPOINTS } from '../config/api'

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get(API_ENDPOINTS.CART)
    return response.data
  },

  // Add to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post(API_ENDPOINTS.ADD_TO_CART, {
      productId,
      quantity,
    })
    return response.data
  },

  // Update cart item
  updateCartItem: async (cartItemId, quantity) => {
    const response = await api.put(
      getApiUrl(API_ENDPOINTS.UPDATE_CART, { id: cartItemId }),
      { quantity }
    )
    return response.data
  },

  // Remove from cart
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(
      getApiUrl(API_ENDPOINTS.REMOVE_FROM_CART, { id: cartItemId })
    )
    return response.data
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete(API_ENDPOINTS.CLEAR_CART)
    return response.data
  },
}


