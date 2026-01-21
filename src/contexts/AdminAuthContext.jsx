// src/contexts/AdminAuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAdminToken, isTokenValid } from '../utils/tokenUtils'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [adminToken, setAdminToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Initialize admin auth state on app load
  useEffect(() => {
    console.log('🔐 AdminAuthProvider: Initializing...')
    
    // ONLY read adminToken, NEVER read userToken
    const savedToken = localStorage.getItem('adminToken')
    const savedAdmin = localStorage.getItem('admin')

    if (savedToken && savedAdmin) {
      // Validate token exists and is actually for ADMIN role
      if (isTokenValid(savedToken) && isAdminToken(savedToken)) {
        console.log('✅ AdminAuthProvider: Valid admin token found')
        setAdminToken(savedToken)
        setAdmin(JSON.parse(savedAdmin))
      } else {
        // Token is invalid or not for admin role
        console.warn('⚠️ AdminAuthProvider: Invalid or non-admin token detected, clearing...')
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        setAdmin(null)
        setAdminToken(null)
      }
    }
    
    setLoading(false)
  }, [])

  const login = (adminData, token) => {
    // Validate token is for admin BEFORE storing
    if (!isAdminToken(token)) {
      console.error('❌ AdminAuthProvider: Attempted to login with non-admin token!')
      setError('Invalid admin credentials')
      return false
    }

    console.log('✅ AdminAuthProvider: Admin login successful')
    
    // DON'T clear user data - just save admin data
    localStorage.setItem('admin', JSON.stringify(adminData))
    localStorage.setItem('adminToken', token)
    
    setAdminToken(token)
    setAdmin(adminData)
    setError(null)
    return true
  }

  const logout = () => {
    console.log('🚪 AdminAuthProvider: Admin logout')
    
    // Clear ONLY admin-specific keys, don't touch user keys
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    
    setAdmin(null)
    setAdminToken(null)
    setError(null)
    
    navigate('/admin/login', { replace: true })
  }

  const value = {
    admin,
    adminToken,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin && !!adminToken && isTokenValid(adminToken),
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}