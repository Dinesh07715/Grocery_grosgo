import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'
import adminApi from '../../api/adminApi'

const AdminOrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // useEffect(() => {
  //     async function getOrders(){
  //       try {
  //         const res = await fetch(`http://localhost:8081/api/orders`);
  //         const jsonRes = await res.json();
  //         setOrder(jsonRes)
  //       } catch (error) {
  //         console.log("Error fetching orders:", error);
  //       }

  //     }
  //     getOrders();
  // },[]);

  /* ===============================
     LOAD ORDER (ADMIN)
     =============================== */
  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // ✅ ADMIN API – token auto attached
      const orderRes = await adminApi.get(`/orders/${id}`)
      const foundOrder = orderRes.data

      let items = []
      try {
        const itemsRes = await adminApi.get(`/orders/${id}/items`)
        items = itemsRes.data || []
      } catch {
        items = foundOrder.items || []
      }

      const normalizedItems = items.map(item => ({
        id: item.id,
        name: item.productName || item.food?.name || 'Unknown Item',
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: `/${(item.imageUrl || '').split('/').pop()}` || '/no-image.png'
      }))

      


      setOrder({
        id: foundOrder.id,
        status: foundOrder.status || 'PLACED',
        totalAmount: foundOrder.totalAmount || 0,
        orderDate: foundOrder.orderDate,
        items: normalizedItems,
        customerName: foundOrder.user?.name || 'Customer',
        customerEmail: foundOrder.user?.email || 'N/A',
        deliveryAddress: foundOrder.deliveryAddress || 'Not provided',
        paymentMethod: foundOrder.paymentMethod || 'COD'
      })

    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Admin access required')
        navigate('/admin/login')
      } else {
        toast.error('Failed to load order')
      }
      setError('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  /* ===============================
     UPDATE ORDER STATUS (ADMIN)
     =============================== */
  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)

      await adminApi.put(`/orders/${id}/status`, null, {
        params: { status: newStatus }
      })

      setOrder(prev => ({ ...prev, status: newStatus }))
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)

    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Admin access required')
        navigate('/admin/login')
      } else {
        toast.error('Failed to update status')
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  /* ===============================
     UI STATES
     =============================== */
  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading order...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-red-600">
          ❌ {error || 'Order not found'}
          <br />
          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    )
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 mb-6 text-blue-600"
        >
          <FiArrowLeft size={20} />
          Back to Orders
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-600">
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={updatingStatus}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              {updatingStatus && <span className="text-sm">Updating…</span>}
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">
                Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-4 border p-4 rounded-lg">
                    <LazyImage
                      src={item.image || '/no-image.png'}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-600">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4">Summary</h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2">Customer</h3>
                <p>{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2">Delivery Address</h3>
                <p>{order.deliveryAddress}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2">Payment</h3>
                <p>{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrderDetail
