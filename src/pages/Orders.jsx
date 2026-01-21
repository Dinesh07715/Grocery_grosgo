// 🔥 COMPLETE FIXED Orders.jsx - Replace your entire Orders.jsx with this

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiRefreshCw } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SkeletonLoader from '../components/SkeletonLoader'
import API from "../api/api"
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Orders = () => {
  const navigate = useNavigate()
  const { checkAndClearCartForDeliveredOrders } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate])

  const refreshOrders = async () => {
    console.log('🔄 REFRESHING ORDERS...')
    setLoading(true)
    await fetchOrders()
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await API.get("/orders/my")
      console.log("🔍 RAW ORDERS:", res.data)
      
      let cleanOrders = Array.isArray(res.data) ? res.data : []
      
      // Clean and normalize order data
      cleanOrders = cleanOrders.map((order, index) => {
        const orderItems = order.items || order.orderItems || order.OrderItems || []
        
        const items = orderItems.map(item => {
          // ✅ FIXED: Extract image filename properly
          let imagePath = item.food?.imageUrl || item.food?.image || item.imageUrl || item.image
          
          // If it's a full path like "http://localhost:8081/uploads/tomato.jpg", extract just "tomato.jpg"
          if (imagePath && imagePath.includes('/')) {
            imagePath = imagePath.split('/').pop()
          }
          
          return {
            id: item.id || `item-${index}-${Date.now()}`,
            food: {
              id: item.food?.id || item.foodId,
              name: item.food?.name || item.name || 'Unknown Item',
              image: imagePath || 'placeholder.jpg', // Just the filename
              price: item.food?.price || item.price || 0
            },
            quantity: item.quantity || 1,
            price: item.price || 0
          }
        })
        
        return {
          id: order.id || `order-${index}`,
          totalAmount: order.totalAmount || 0,
          status: order.status || 'PLACED',
          orderDate: order.orderDate || order.createdAt || new Date().toISOString(),
          items: items,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod
        }
      })
      
      console.log("✅ CLEAN ORDERS:", cleanOrders)
      setOrders(cleanOrders)
      
      await checkAndClearCartForDeliveredOrders()
      
    } catch (error) {
      console.error("❌ FETCH ERROR:", error.response?.data || error)
      setOrders([])
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Please login to view your orders")
      } else if (error.response?.status === 404) {
        setOrders([])
      } else {
        toast.error("Failed to load orders")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PLACED: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      'OUT_FOR_DELIVERY': 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-12 text-center max-w-md mx-auto">
            <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status === filter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
          
          <div className="flex flex-wrap gap-2 items-center">
            {['all', 'PLACED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {status === 'all' ? 'All Orders' : status.replace('_', ' ')}
              </button>
            ))}
            <button
              onClick={refreshOrders}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-1 ml-2 disabled:opacity-50"
            >
              <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh ({orders.length})
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Items with FIXED image path */}
              <div className="space-y-4 mb-6">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={`/${item.food?.image || 'placeholder.jpg'}`}
                        alt={item.food?.name || 'Item'}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          console.log('❌ Image failed to load:', e.target.src)
                          e.target.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.food?.name || 'Unknown Item'}
                        </h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items found</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <div className="text-2xl font-bold text-gray-900 text-right sm:text-left sm:flex-1">
                  Total: ₹{order.totalAmount.toLocaleString()}
                </div>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Orders