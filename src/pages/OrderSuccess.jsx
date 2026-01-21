import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiHome, FiShoppingBag } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LazyImage from '../components/LazyImage'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Clear cart on successful order
    // In real app, this would be handled after order confirmation
    const cart = localStorage.getItem('cart')
    if (cart) {
      // Keep cart in localStorage but mark as ordered
      // Or clear it if backend confirms order
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
              <FiCheckCircle className="text-green-600" size={64} />
            </div>
            <LazyImage
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
              alt="Order Success"
              className="w-64 h-64 mx-auto mb-6 rounded-lg"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. We've received it and will start processing it right away.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8 text-left">
            <div className="flex items-center gap-3 mb-6">
              <FiPackage className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">{orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium text-primary-600">10-15 mins</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-gray-700">Order Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Preparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Out for Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Delivered</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/orders/${orderId}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <FiPackage size={20} />
              View Order
            </Link>
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              My Orders
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <FiShoppingBag size={20} />
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="tel:+919876543210" className="text-primary-600 font-medium hover:underline">
                +91 98765 43210
              </a>{' '}
              or{' '}
              <Link to="/help" className="text-primary-600 font-medium hover:underline">
                visit our help center
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default OrderSuccess


