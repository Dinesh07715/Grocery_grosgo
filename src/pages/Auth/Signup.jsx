import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPhone, FiMail, FiUser, FiLock } from 'react-icons/fi'
import { validatePhoneNumber, validateEmail } from '../../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'
import API from '../../api/api'

const Signup = () => {
  const navigate = useNavigate()

  const [signupMethod, setSignupMethod] = useState('phone')
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Clear admin credentials when accessing user signup page
  useEffect(() => {
    console.log('🔄 User Signup page loaded - clearing admin credentials')
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
  }, [])

  // 📱 PHONE SIGNUP (OTP – demo only)
  const handlePhoneSignup = async (e) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Enter valid phone number')
      return
    }

    localStorage.setItem('tempPhone', phoneNumber)
    toast.success('OTP sent (demo)')
    navigate('/otp-verify?type=signup')
  }

  // 📧 EMAIL SIGNUP (REAL)
  const handleEmailSignup = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)

      await API.post("/users/register", {
        name,
        email,
        password,
        role: "USER"  // 🔑 Set default role for users
      })

      toast.success("Signup successful! Please login.")
      navigate("/login")

    } catch (err) {
      // ✅ FIXED: Changed 'respose' to 'response'
      console.error("SIGNUP ERROR:", err.response?.data)

      const message = 
        err.response?.data?.message || "Signup failed. Please try again."

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 p-8">
          <div className="text-center">
            <LazyImage
              src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600"
              alt="Signup"
              className="w-full max-w-md mb-6 rounded-lg"
            />
            <h2 className="text-white text-3xl font-bold">Join GROGOS</h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-6">Create Account</h1>

          {/* TOGGLE */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setSignupMethod('phone')}
              className={signupMethod === 'phone' ? 'text-primary-600 border-b-2 border-primary-600 pb-2' : 'text-gray-500'}
            >
              <FiPhone className="inline mr-2" /> Phone
            </button>
            <button
              onClick={() => setSignupMethod('email')}
              className={signupMethod === 'email' ? 'text-primary-600 border-b-2 border-primary-600 pb-2' : 'text-gray-500'}
            >
              <FiMail className="inline mr-2" /> Email
            </button>
          </div>

          {/* PHONE FORM */}
          {signupMethod === 'phone' ? (
            <form onSubmit={handlePhoneSignup} className="space-y-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <button className="w-full bg-primary-600 text-white py-3 rounded-lg">
                Continue with OTP
              </button>
            </form>
          ) : (

            /* EMAIL FORM */
            <form onSubmit={handleEmailSignup} className="space-y-4">

              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

            </form>

          )}

          <p className="mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup