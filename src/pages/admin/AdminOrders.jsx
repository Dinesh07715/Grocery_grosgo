import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import adminApi from '../../api/adminApi'

const AdminOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
  try {
    setLoading(true)

    // ✅ ONLY adminApi (NO fetch, NO token)
    const res = await adminApi.get('/orders')
    const ordersData = Array.isArray(res.data) ? res.data : []

    const normalizedOrders = ordersData.map(order => ({
      id: order.id,
      userId: order.userId || order.user?.id,
      userName: order.user?.name || `User #${order.userId || order.id}`,
      userEmail: order.user?.email || 'N/A',
      status: order.status || 'PLACED',
      totalAmount: order.totalAmount || 0,
      orderDate: order.orderDate || new Date().toISOString(),
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      itemCount: order.orderItems?.length || 1
    }))

    setOrders(normalizedOrders)
    console.log('✅ Admin orders loaded:', normalizedOrders.length)

  } catch (error) {
    console.error('❌ LoadOrders ERROR:', error)

    if (error.response?.status === 403) {
      toast.error('Admin access required')
      navigate('/admin/login')
    } else if (error.response?.status === 401) {
      toast.error('Admin session expired')
      navigate('/admin/login')
    } else {
      toast.error('Failed to load orders')
    }

    setOrders([])
  } finally {
    setLoading(false)
  }
}


  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </AdminLayout>
    )
  }

  const getStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase()
    if (statusUpper === 'DELIVERED') return 'bg-green-100 text-green-800'
    if (statusUpper === 'CANCELLED') return 'bg-red-100 text-red-800'
    if (statusUpper.includes('OUT_FOR_DELIVERY')) return 'bg-purple-100 text-purple-800'
    if (statusUpper === 'CONFIRMED') return 'bg-blue-100 text-blue-800'
    if (statusUpper === 'PLACED') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Orders ({orders.length})</h1>
          <button 
            onClick={loadOrders}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {orders.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-lg mb-2 font-medium">No orders found</p>
              <p className="text-sm mb-6">New orders will appear here when customers place them.</p>
              <button 
                onClick={loadOrders} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
              >
                Retry loading orders
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.userName}</div>
                          {order.userEmail && order.userEmail !== 'N/A' && (
                            <div className="text-xs text-gray-500">{order.userEmail}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status?.replace('_', ' ').toUpperCase() || 'PLACED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.itemCount || 0} item(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 font-semibold transition-colors"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
