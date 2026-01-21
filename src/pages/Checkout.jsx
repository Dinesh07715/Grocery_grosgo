import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiMapPin, FiClock, FiCreditCard, FiCheck } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LazyImage from '../components/LazyImage'
import { useCart } from '../contexts/CartContext'
import { useLocation as useLocationContext } from '../contexts/LocationContext'
import { useAuth } from '../contexts/AuthContext'
// import { orderService } from '../services/orderService'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'
import API from "../api/api"
// import {userNavigate} from "react-router-dom"


const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, coupon, getCartTotal, getDeliveryCharge, getFinalTotal, placeOrder } = useCart()
  const { addresses, selectedLocation, setLocation, saveAddress, detectLocation } = useLocationContext()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10-15')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)

  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    lat: null,
    lng: null,
  })

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart')
      return
    }

    // Set default address
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0]
      setSelectedAddress(defaultAddress)
    } else if (selectedLocation && !selectedAddress) {
      setSelectedAddress(selectedLocation)
    }
  }, [cart, addresses, selectedLocation, selectedAddress, navigate])

  const timeSlots = [
    { value: '10-15', label: '10-15 mins', available: true },
    { value: '15-30', label: '15-30 mins', available: true },
    { value: '30-45', label: '30-45 mins', available: true },
    { value: '45-60', label: '45-60 mins', available: true },
  ]

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      available: true,
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      available: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      available: true,
    },
  ]

  const handleSaveAddress = async (e) => {
    e.preventDefault()

    if (!newAddress.address || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const savedAddress = await saveAddress(newAddress)
      setSelectedAddress(savedAddress)
      setShowAddressForm(false)
      setShowAddressModal(false)
      setNewAddress({
        type: 'Home',
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        lat: null,
        lng: null,
      })
      toast.success('Address saved successfully')
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleUseCurrentLocation = async () => {
    try {
      const location = await detectLocation()
      setNewAddress({
        ...newAddress,
        lat: location.lat,
        lng: location.lng,
        address: location.address || '',
      })
      toast.success('Location detected successfully')
    } catch (error) {
      toast.error('Failed to detect location. Please enter manually.')
    }
  }

  
const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    toast.error("Please select delivery address");
    return;
  }

  try {
    setLoading(true);

    // Use CartContext's placeOrder function with proper payload
    const newOrder = await placeOrder(selectedAddress, paymentMethod);

    if (newOrder) {
      navigate("/orders");
    }

  } catch (error) {
    console.error("Order placement error:", error);
    // Error handling is done in CartContext's placeOrder
  } finally {
    setLoading(false);
  }
};





  const subtotal = getCartTotal()
  const deliveryCharge = getDeliveryCharge()
  const finalTotal = getFinalTotal()
  const discount = coupon
    ? coupon.type === 'flat'
      ? coupon.discount
      : Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <FiPlus size={18} />
                  Add New
                </button>
              </div>

              {selectedAddress ? (
                <div className="border-2 border-primary-600 rounded-lg p-4 bg-primary-50">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-primary-600 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{selectedAddress.name || 'User'}</span>
                        {selectedAddress.type && (
                          <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                            {selectedAddress.type}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-1">{selectedAddress.address}</p>
                      {selectedAddress.landmark && (
                        <p className="text-sm text-gray-600">Near {selectedAddress.landmark}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.phone && (
                        <p className="text-sm text-gray-600 mt-1">Phone: {selectedAddress.phone}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-600 transition-colors"
                >
                  <FiPlus size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">Add Delivery Address</p>
                </button>
              )}
            </div>

            {/* Delivery Time */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="text-primary-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Delivery Time</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setSelectedTimeSlot(slot.value)}
                    disabled={!slot.available}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      selectedTimeSlot === slot.value
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : slot.available
                        ? 'border-gray-300 hover:border-primary-600 text-gray-700'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <p className="font-medium">{slot.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="text-primary-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={!method.available}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === method.id
                        ? 'border-primary-600 bg-primary-50'
                        : method.available
                        ? 'border-gray-300 hover:border-primary-600'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="flex-1 text-left font-medium">{method.name}</span>
                    {paymentMethod === method.id && (
                      <FiCheck className="text-primary-600" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items */}
            {/* Order Items */}
<div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
  <div className="space-y-4">

    {cart
      .filter(item => item && item.product)   // 🔥 Prevents crash
      .map((item) => (
        <div key={item.product.id} className="flex gap-4">
          <LazyImage
            src={item.product.image ? (item.product.image.startsWith('/') ? item.product.image : '/' + item.product.image) : '/no-image.png'}   // ✅ Normalize image path
            alt={item.product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-500">{item.product.quantity}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">
              {formatPrice(item.product.price)} × {item.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}

    {cart.length === 0 && (
      <p className="text-gray-500 text-center">Your cart is empty</p>
    )}

  </div>
</div>

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Select or Add Address</h3>
              <button
                onClick={() => {
                  setShowAddressModal(false)
                  setShowAddressForm(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {!showAddressForm ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-600 transition-colors mb-4"
                >
                  <FiPlus size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">Add New Address</p>
                </button>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => {
                        setSelectedAddress(address)
                        setShowAddressModal(false)
                      }}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-primary-600 mt-1" size={20} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{address.name || 'User'}</span>
                            {address.type && (
                              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                                {address.type}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{address.address}</p>
                          {address.landmark && (
                            <p className="text-xs text-gray-600">Near {address.landmark}</p>
                          )}
                          <p className="text-xs text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <FiCheck className="text-primary-600" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type *
                    </label>
                    <select
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Near..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <FiMapPin size={18} />
                  Use Current Location
                </button>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Checkout


