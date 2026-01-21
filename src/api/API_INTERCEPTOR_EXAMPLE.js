/**
 * 🔐 USER API INTERCEPTOR
 * (DO NOT USE FOR ADMIN)
 */

import axios from 'axios'
import toast from 'react-hot-toast'
import { isTokenValid } from '../utils/tokenUtils'

const API = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (USER ONLY)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken')

    if (token) {
      if (!isTokenValid(token)) {
        console.error('🚨 USER API: Token expired')

        localStorage.removeItem('userToken')
        localStorage.removeItem('user')

        if (!window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login'
        }

        return Promise.reject(new Error('Token expired'))
      }

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (USER ONLY)
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/admin')) {
        toast.error('Not authenticated. Please login.')
      }
    }
    return Promise.reject(error)
  }
)

export default API
