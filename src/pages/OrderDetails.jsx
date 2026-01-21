import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FiArrowLeft, FiPackage, FiCalendar, FiMapPin, FiCreditCard } from "react-icons/fi"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { formatPrice } from "../utils/helpers"
import OrderStatusTimeline from "../components/OrderStatusTimeline"
import API from '../api/api'
import toast from 'react-hot-toast'
import SkeletonLoader from '../components/SkeletonLoader'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchOrder()
    } else {
      setError('Invalid order ID')
      setLoading(false)
    }
  }, [id])

  // ✅ FIX: Normalize image path to match ProductCard logic
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/no-image.png'

    // Normalize path: ensure it starts with '/'
    const normalizedPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath
    return normalizedPath
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await API.get(`/orders/${id}`)
      const orderData = res.data
      
      // Handle different response structures
      const orderItems = orderData.items || orderData.orderItems || orderData.OrderItems || []
      
      // Normalize order data with fixed image URLs
      const normalizedOrder = {
        id: orderData.id,
        status: orderData.status || 'PLACED',
        totalAmount: orderData.totalAmount || 0,
        orderDate: orderData.orderDate || orderData.createdAt || new Date().toISOString(),
        deliveryAddress: orderData.deliveryAddress || 'Not provided',
        paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
        items: orderItems.map(item => {
          // ✅ FIX: Get product data from different possible structures
          const product = item.product || item.food || {}
          const imageUrl = product.imageUrl || product.image || item.imageUrl || item.image
          
          return {
            id: item.id,
            food: {
              id: product.id || item.productId || item.foodId,
              name: product.name || item.name || 'Unknown Item',
              image: getImageUrl(imageUrl), // ✅ Use fixed image URL
              price: item.price || product.price || 0
            },
            quantity: item.quantity || 1,
            price: item.price || product.price || 0
          }
        }),
        statusTimeline: orderData.statusTimeline || {}
      }
      
      setOrder(normalizedOrder)
    } catch (error) {
      console.error("Order fetch error:", error)
      
      if (error.response?.status === 404) {
        setError('Order not found')
        toast.error('Order not found')
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Unauthorized access')
        toast.error('Please login to view order details')
        setTimeout(() => navigate("/orders"), 2000)
      } else {
        setError('Failed to load order details')
        toast.error('Failed to load order details')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <SkeletonLoader variant="productList" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-12 text-center max-w-md mx-auto">
            <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'Order details could not be loaded'}</p>
            <button
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              <FiArrowLeft /> Back to Orders
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 mb-6 text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft /> Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  <span>{new Date(order.orderDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-100 text-purple-800' :
                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <OrderStatusTimeline
            currentStatus={order.status}
            statusTimeline={order.statusTimeline}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      {/* ✅ FIXED: Image with proper URL and error handling */}
                      <img
                        src={item.food?.image}
                        alt={item.food?.name || 'Item'}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', item.food?.image)
                          e.target.src = 'https://via.placeholder.com/80?text=🍅'
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.food?.name || 'Unknown Item'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.items.reduce((sum, item) => 
                      sum + (item.price || 0) * (item.quantity || 1), 0
                    ))}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiMapPin /> Delivery Address
              </h3>
              <p className="text-gray-600 text-sm">{order.deliveryAddress}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiCreditCard /> Payment Method
              </h3>
              <p className="text-gray-600 text-sm">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderDetails