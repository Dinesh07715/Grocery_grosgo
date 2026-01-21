import API from '../api/api'
import { getApiUrl, API_ENDPOINTS } from '../config/api'

export const locationService = {
  // Get locations
  getLocations: async (query) => {
    const response = await api.get(API_ENDPOINTS.LOCATIONS, { params: { q: query } })
    return response.data
  },

  // Check serviceability
  checkServiceability: async (lat, lng) => {
    const response = await api.get(API_ENDPOINTS.SERVICEABILITY, {
      params: { lat, lng },
    })
    return response.data
  },

  // Get addresses
  getAddresses: async () => {
    const response = await api.get(API_ENDPOINTS.ADDRESSES)
    return response.data
  },

  // Save address
  saveAddress: async (addressData) => {
    const response = await api.post(API_ENDPOINTS.SAVE_ADDRESS, addressData)
    return response.data
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(getApiUrl(API_ENDPOINTS.DELETE_ADDRESS, { id: addressId }))
    return response.data
  },
}


