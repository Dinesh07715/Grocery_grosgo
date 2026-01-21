// src/pages/auth/Login.jsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'
import { validatePhoneNumber, validateEmail } from '../../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'

const Login = () => {
  const navigate = useNavigate()
  const { login, loginWithEmail } = useAuth()
  const [loginMethod, setLoginMethod] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // DON'T clear admin credentials - just let them coexist
  useEffect(() => {
    console.log('🔄 User Login page loaded')
    // No clearing - both can exist together
  }, [])

  const handlePhoneLogin = async (e) => {
    e.preventDefault()
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    try {
      setLoading(true)
      // Don't clear admin data
      
      // In real app, send OTP
      // await authService.sendOTP(phoneNumber)
      // For demo, simulate OTP sent
      localStorage.setItem('tempPhone', phoneNumber)
      navigate('/otp-verify?type=login')
      toast.success('OTP sent to your phone')
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      
      // Don't clear admin data - they can coexist
      const user = await loginWithEmail(email, password)
      console.log('✅ Login successful, user:', user)
      toast.success('Logged in successfully')

      // Wait a bit for AuthContext to update, then navigate
      setTimeout(() => {
        console.log('Attempting navigation to home...')
        navigate('/', { replace: true })
      }, 100)

    } catch (error) {
      console.error('❌ Login failed:', error)
      toast.error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-8">
          <div className="text-center">
            <LazyImage
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
              alt="Login Illustration"
              className="w-full max-w-md mb-6 rounded-lg"
            />
            <h2 className="text-white text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-primary-100">
              Get instant grocery delivery at your doorstep. Fast, fresh, and reliable.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-primary-600">GROGOS</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Login to continue shopping</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`px-4 py-2 font-medium transition-colors ${
                loginMethod === 'phone'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiPhone className="inline mr-2" />
              Phone
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`px-4 py-2 font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiMail className="inline mr-2" />
              Email
            </button>
          </div>

          {/* Phone Login Form */}
          {loginMethod === 'phone' ? (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            /* Email Login Form */
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-medium hover:text-primary-700">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login