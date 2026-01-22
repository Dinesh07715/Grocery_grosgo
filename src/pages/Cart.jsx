// 🔥 COMPLETE FIXED Cart.jsx - Replace your entire Cart.jsx with this

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiTag, FiMapPin, FiCreditCard } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LazyImage from '../components/LazyImage'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'
import { mockCoupons } from '../utils/mockData'
import { BASE_URL } from '../api/api'

const Cart = () => {
  const navigate = useNavigate()
  const {
    cart, loading, coupon, updateCartItem, removeFromCart, clearCart,
    getCartTotal, getCartCount, getDeliveryCharge, getFinalTotal,
    applyCoupon, 
  } = useCart()

  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState([])

  useEffect(() => {
    setAvailableCoupons(mockCoupons)
  }, [])

  // ✅ FIXED: Real API call to Spring Boot backend
  const handlePlaceOrder = async () => {
    // Validation
    if (!address.trim() || address.length < 10) {
      toast.error('Please enter a valid delivery address')
      return
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Cart is empty!')
      return
    }

    try {
      setIsPlacingOrder(true)

      // ✅ Get JWT token from localStorage
      const token = localStorage.getItem('userToken')
      
      if (!token) {
        toast.error('Please login to place order')
        navigate('/login')
        return
      }

      console.log('📤 Placing order to backend...')
      console.log('🛒 Cart items:', cart.items.length)
      
      // ✅ Call your Spring Boot API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/place`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deliveryAddress: address
        })
      })

      console.log('📥 Backend response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend error:', errorText)
        
        if (response.status === 401) {
          toast.error('Session expired. Please login again.')
          navigate('/login')
          return
        }
        
        throw new Error(`Order failed: ${response.status}`)
      }

      const order = await response.json()
      console.log('✅ Order created in database:', order)
      console.log('✅ Order ID:', order.id)

      // ✅ Clear cart after successful order
      await clearCart()

      toast.success(`✅ Order #${order.id} placed successfully!`, {
        duration: 4000,
        icon: '🎉'
      })
      
      // Navigate to orders page after short delay
      setTimeout(() => {
        navigate('/orders')
      }, 1500)
      
    } catch (error) {
      console.error('❌ Place order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Update quantity handler
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const cartItem = cart.items.find(item => item.food?.id === productId || item.id === productId)
      if (cartItem) await removeFromCart(cartItem.id)
    } else {
      await updateCartItem(productId, newQuantity)
    }
  }

  // Apply coupon handler
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    const foundCoupon = availableCoupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase().trim()
    )
    if (foundCoupon) {
      const applied = applyCoupon(foundCoupon)
      if (applied) {
        setCouponCode('')
        setShowCouponInput(false)
      }
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const subtotal = getCartTotal()
  const deliveryCharge = getDeliveryCharge()
  const finalTotal = getFinalTotal()
  const cartCount = getCartCount()
  const discount = coupon ? 
    coupon.type === 'flat' ? coupon.discount : 
    Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount) : 0

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p>Loading cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Empty cart state
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-8xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">
              <FiShoppingBag /> Start Shopping
            </Link>
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
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* CART ITEMS SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  My Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </h1>
                <button onClick={clearCart} 
                  className="text-red-600 hover:text-red-700 font-semibold text-sm px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {(cart?.items || []).map(item => {
                  const product = item.food || item;
                  const productId = product.id || item.id;
                  
                  return (
                    <div key={item.id} className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                      <LazyImage 
                        src={`/${(item.food?.imageUrl || item.imageUrl || '').split('/').pop()}`}
                        alt={product.name || item.name}
                        onError={(e) => (e.target.src = "/no-image.png")}
                        className="w-28 h-28 rounded-xl object-cover shadow-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${productId}`} className="hover:text-primary-600">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                            {product.name || item.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border">
                            <button onClick={() => handleUpdateQuantity(productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-all">
                              <FiMinus size={20} />
                            </button>
                            <span className="text-2xl font-bold min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button onClick={() => handleUpdateQuantity(productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                              <FiPlus size={20} />
                            </button>
                          </div>
                          
                          <button onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-lg text-gray-600">₹{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Order</h2>

              {/* Address */}
              <div className="space-y-3 mb-8">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FiMapPin size={22} />
                  Delivery Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no 12, MG Road, Near XYZ Mall, Mumbai - 400001"
                  rows={3}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-500 resize-none text-lg"
                />
                {address.length < 10 && address.length > 0 && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ⚠️ Address needs to be at least 10 characters
                  </p>
                )}
              </div>

              {/* Payment */}
              <div className="space-y-3 mb-8">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <FiCreditCard size={22} />
                  Payment Method
                </label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500 focus:border-primary-500 text-lg">
                  <option value="cash">💰 Cash on Delivery</option>
                  <option value="card">💳 Credit/Debit Card</option>
                  <option value="upi">📱 UPI</option>
                </select>
              </div>

              {/* Price Summary */}
              <div className="space-y-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="flex justify-between text-lg">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                
                {deliveryCharge > 0 && subtotal < 199 && (
                  <div className="text-sm bg-yellow-100 p-3 rounded-xl border-l-4 border-yellow-400">
                    💡 Add ₹{formatPrice(199 - subtotal)} more for FREE delivery 🚚
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-black text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={!address || address.length < 10 || cart.items.length === 0 || isPlacingOrder}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-white py-5 px-8 rounded-2xl text-xl font-black shadow-2xl hover:from-emerald-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-emerald-500 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-4 shadow-emerald-500/50"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiShoppingBag size={26} />
                    Place Order Now
                    <div className="text-lg bg-white/20 px-4 py-1 rounded-xl">
                      ₹{finalTotal.toLocaleString()}
                    </div>
                  </>
                )}
              </button>

              <button onClick={() => navigate('/')}
                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-900 font-semibold border-t pt-4 transition-colors">
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Cart