// src/services/authService.js

import { isUserToken } from '../utils/tokenUtils'

const API_URL = import.meta.env.VITE_API_BASE_URL


export const authService = {
  // Send OTP to phone number
  sendOTP: async (phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send OTP')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  // Verify OTP and login/signup
  verifyOTP: async (phoneNumber, otp) => {
    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Invalid OTP')
      }

      const data = await response.json()
      
      // Validate token is for USER role
      if (!isUserToken(data.token)) {
        throw new Error('Invalid user credentials')
      }

      // DON'T clear admin data - just save user credentials
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  },

  // Login with email and password
  loginWithEmail: async (email, password) => {
    try {
      console.log('🔐 authService: Attempting email login...')
      
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      console.log('📦 authService: Login response received', data)

      // Validate token is for USER role (not ADMIN)
      if (!isUserToken(data.token)) {
        throw new Error('Access denied. Please use user credentials.')
      }

      // DON'T clear admin data - just save user credentials
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      console.log('✅ authService: User credentials saved')
      
      return data.user
    } catch (error) {
      console.error('❌ authService: Login error:', error)
      throw error
    }
  },

  // Signup with email and password
  signupWithEmail: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Signup failed')
      }

      const data = await response.json()
      
      // Validate token is for USER role
      if (!isUserToken(data.token)) {
        throw new Error('Invalid user credentials')
      }

      // DON'T clear admin data - just save user credentials
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data
    } catch (error) {
      throw error
    }
  },

  // Logout user
  logout: () => {
    // Clear ONLY user credentials, don't touch admin
    localStorage.removeItem('user')
    localStorage.removeItem('userToken')
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('userToken')
    
    if (!userStr || !token || !isUserToken(token)) {
      return null
    }
    
    return JSON.parse(userStr)
  },

  // Update user profile
  updateProfile: async (userId, userData, token) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Update failed')
      }

      const data = await response.json()
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data.user
    } catch (error) {
      throw error
    }
  },
}