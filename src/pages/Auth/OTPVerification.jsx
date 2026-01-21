import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'
import { validateOTP } from '../../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()

  const type = searchParams.get('type') || 'login' // login | signup

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showNameForm, setShowNameForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const inputRefs = useRef([])

  const phoneNumber = localStorage.getItem('tempPhone') || ''

  useEffect(() => {
    // Clear admin credentials when accessing user OTP verification page
    console.log('🔄 User OTP Verification page loaded - clearing admin credentials')
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')

    inputRefs.current[0]?.focus()

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')

    if (!validateOTP(otpValue)) {
      toast.error('Enter valid 6-digit OTP')
      return
    }

    try {
      setLoading(true)

      if (type === 'login') {
        const { user } = await authService.verifyOTP(phoneNumber, otpValue)
        updateUser(user)
        toast.success('Logged in successfully')
        navigate('/')
      } else {
        await authService.verifyOTP(phoneNumber, otpValue)
        setShowNameForm(true)
      }
    } catch (error) {
      toast.error('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSignup = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setLoading(true)

      await authService.signup(
        phoneNumber,
        otp.join(''),
        name,
        email,
        referralCode
      )

      const user = authService.getCurrentUser()
      updateUser(user)

      localStorage.removeItem('tempPhone')
      toast.success('Account created successfully')
      navigate('/')
    } catch (error) {
      toast.error('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return
    try {
      await authService.resendOTP(phoneNumber)
      toast.success('OTP resent')
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
    } catch {
      toast.error('Failed to resend OTP')
    }
  }

  /* ===================== SIGNUP NAME FORM ===================== */
  if (showNameForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleCompleteSignup} className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Complete Profile</h2>

          <input
            className="w-full border p-2 mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="w-full border p-2 mb-3"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-4"
            placeholder="Referral Code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-primary-600 text-white p-2 rounded"
          >
            {loading ? 'Creating...' : 'Complete Signup'}
          </button>
        </form>
      </div>
    )
  }

  /* ===================== OTP FORM ===================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleVerifyOTP} className="bg-white p-6 rounded-lg w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 mb-4 text-gray-600"
        >
          <FiArrowLeft /> Back
        </button>

        <LazyImage
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400"
          className="w-24 h-24 mx-auto mb-4 rounded-full"
        />

        <p className="text-center mb-4">
          Enter OTP sent to <b>{phoneNumber}</b>
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className="w-10 h-10 text-center border text-lg"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
            />
          ))}
        </div>

        <button
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-primary-600 text-white p-2 rounded"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={countdown > 0}
          className="mt-4 text-primary-600 flex items-center gap-2 mx-auto"
        >
          <FiRefreshCw />
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </button>
      </form>
    </div>
  )
}

export default OTPVerification
