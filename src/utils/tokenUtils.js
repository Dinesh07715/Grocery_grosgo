// src/utils/tokenUtils.js

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null
    
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Date.now() / 1000
  return decoded.exp < currentTime
}

/**
 * Check if token is valid (exists and not expired)
 * @param {string} token - JWT token
 * @returns {boolean} True if token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false
  
  const decoded = decodeToken(token)
  if (!decoded) return false
  
  return !isTokenExpired(token)
}

/**
 * Check if token belongs to an ADMIN user
 * @param {string} token - JWT token
 * @returns {boolean} True if token has ADMIN role
 */
export const isAdminToken = (token) => {
  const decoded = decodeToken(token)
  if (!decoded) return false
  
  // Check role field (adjust based on your JWT structure)
  return decoded.role === 'ADMIN' || decoded.role === 'admin'
}

/**
 * Check if token belongs to a regular USER
 * @param {string} token - JWT token
 * @returns {boolean} True if token has USER role
 */
export const isUserToken = (token) => {
  const decoded = decodeToken(token)
  if (!decoded) return false
  
  // Check role field (adjust based on your JWT structure)
  return decoded.role === 'USER' || decoded.role === 'user'
}

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} User role or null
 */
export const getTokenRole = (token) => {
  const decoded = decodeToken(token)
  return decoded?.role || null
}

/**
 * Clear all authentication data (both user and admin)
 * Use this for complete logout or when switching between user types
 */
export const clearAllAuth = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('userToken')
  localStorage.removeItem('admin')
  localStorage.removeItem('adminToken')
}

/**
 * Clear only user authentication data
 */
export const clearUserAuth = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('userToken')
}

/**
 * Clear only admin authentication data
 */
export const clearAdminAuth = () => {
  localStorage.removeItem('admin')
  localStorage.removeItem('adminToken')
}