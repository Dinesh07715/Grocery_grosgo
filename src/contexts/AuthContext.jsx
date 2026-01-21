// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { isUserToken, isTokenValid } from '../utils/tokenUtils'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

  /**
   * ======================================
   * INITIALIZE USER AUTH (USER ROUTES ONLY)
   * ======================================
   */
  useEffect(() => {
    // 🚫 DO NOT RUN USER AUTH ON ADMIN ROUTES
    if (window.location.pathname.startsWith('/admin')) {
      console.log('⏭️ AuthProvider skipped on admin route')
      setLoading(false)
      return
    }

    console.log('🔐 AuthProvider: Initializing...')

    const savedToken = localStorage.getItem('userToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      if (isTokenValid(savedToken) && isUserToken(savedToken)) {
        console.log('✅ AuthProvider: Valid user token found')
        setUserToken(savedToken)
        setUser(JSON.parse(savedUser))
      } else {
        console.warn('⚠️ AuthProvider: Invalid or non-user token detected, clearing...')
        localStorage.removeItem('user')
        localStorage.removeItem('userToken')
        setUser(null)
        setUserToken(null)
      }
    }

    setLoading(false)
  }, [])

  /**
   * ======================================
   * USER LOGIN (OTP)
   * ======================================
   */
  const login = async (phoneNumber, otp, name, email, referralCode) => {
    try {
      const res = await authService.verifyOTP(phoneNumber, otp)

      if (!isUserToken(res.token)) {
        throw new Error('Invalid token: not a user token')
      }

      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('userToken', res.token)

      setUserToken(res.token)
      setUser(res.user)
      setError(null)

      return res.user
    } catch (error) {
      console.error('AuthProvider: OTP login failed:', error)
      setError(error.message)
      throw error
    }
  }

  /**
   * ======================================
   * USER LOGIN (EMAIL)
   * ======================================
   */
  const loginWithEmail = async (email, password) => {
  try {
    // ✅ GitHub Pages / Demo mode
    if (DEMO_MODE) {
      console.warn('🧪 Demo mode: email login mocked')

      const demoUser = {
        id: 1,
        name: 'Demo User',
        email,
        role: 'USER',
      }

      const demoToken = 'demo-user-token'

      localStorage.setItem('user', JSON.stringify(demoUser))
      localStorage.setItem('userToken', demoToken)

      setUser(demoUser)
      setUserToken(demoToken)
      setError(null)

      return demoUser
    }

    // 🔐 Real backend login (local / future prod)
    const user = await authService.loginWithEmail(email, password)

    const token = localStorage.getItem('userToken')
    if (!token || !isUserToken(token)) {
      throw new Error('Invalid token: not a user token')
    }

    setUserToken(token)
    setUser(user)
    setError(null)

    console.log('✅ AuthProvider: Email login successful')
    return user
  } catch (error) {
    console.error('AuthProvider: Email login failed:', error)
    setError(error.message)
    throw error
  }
}


  /**
   * ======================================
   * USER LOGOUT
   * ======================================
   */
  const logout = () => {
    console.log('🚪 AuthProvider: User logout')

    localStorage.removeItem('user')
    localStorage.removeItem('userToken')

    setUser(null)
    setUserToken(null)
    setError(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    userToken,
    loading,
    error,
    login,
    loginWithEmail,
    logout,
    updateUser,
    isAuthenticated: !!user && !!userToken && isTokenValid(userToken),
  }

  if (DEMO_MODE) {
  return {
    token: 'demo-token',
    user: {
      email,
      role: 'USER',
    },
  }
}


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>



}