import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/api'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemCount, setItemCount] = useState(0)

  /**
   * ======================================
   * LOAD CART (USER ROUTES ONLY)
   * ======================================
   */
  const loadCart = async () => {
    // 🚫 NEVER load cart on admin routes
    if (window.location.pathname.startsWith('/admin')) {
      console.log('⏭️ CartContext skipped on admin route')
      setLoading(false)
      return
    }

    try {
      const userToken = localStorage.getItem('userToken')

      if (!userToken) {
        console.log('⚠️ No user token - skipping cart load')
        setCart(null)
        setItemCount(0)
        setLoading(false)
        return
      }

      console.log('🛒 Loading cart with user token...')

      const response = await API.get('/cart/my', {
        headers: {
          'X-Use-Token': 'user'
        }
      })

      setCart(response.data)
      setItemCount(response.data.items?.length || 0)
      console.log('✅ Cart loaded successfully')
    } catch (error) {
      console.error('Error loading cart:', error)

      // ❌ NEVER clear tokens on admin routes
      if (!window.location.pathname.startsWith('/admin')) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('🚫 Invalid user cart token - clearing user auth')
          localStorage.removeItem('user')
          localStorage.removeItem('userToken')
          setCart(null)
          setItemCount(0)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * ======================================
   * INIT LOAD
   * ======================================
   */
  useEffect(() => {
    loadCart()
  }, [])

  /**
   * ======================================
   * CART COUNT
   * ======================================
   */
  const getCartCount = () => itemCount

  /**
   * ======================================
   * CART TOTAL CALCULATIONS
   * ======================================
   */
  const getCartTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryCharge = () => {
    const subtotal = getCartTotal()
    if (subtotal === 0) return 0
    if (subtotal > 500) return 0 // Free delivery above 500
    return 30 // Standard delivery charge
  }

  const getFinalTotal = () => {
    return getCartTotal() + getDeliveryCharge()
  }

  /**
   * ======================================
   * CLEAR CART ON DELIVERED ORDER (USER ONLY)
   * ======================================
   */
  const checkAndClearCartForDeliveredOrders = async (orders) => {
    // 🚫 Admin safety
    if (window.location.pathname.startsWith('/admin')) return

    if (!Array.isArray(orders) || orders.length === 0) return
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) return

    try {
      const hasDeliveredOrder = orders.some(
        order =>
          order?.status === 'DELIVERED' ||
          order?.status === 'delivered'
      )

      if (hasDeliveredOrder) {
        console.log('🧹 Delivered order found - clearing cart')
        await clearCart()
      }
    } catch (error) {
      console.error('Error checking/clearing cart:', error)
    }
  }

  /**
   * ======================================
   * CART ACTIONS (USER ONLY)
   * ======================================
   */
  const requireUserToken = () => {
    if (window.location.pathname.startsWith('/admin')) {
      throw new Error('Cart actions not allowed on admin pages')
    }

    const token = localStorage.getItem('userToken')
    if (!token) {
      throw new Error('Please login to continue')
    }
    return token
  }

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    const token = requireUserToken()
    console.log('🛒 Adding to cart with token:', token?.substring(0, 20) + '...')

    try {
      const response = await API.post(
        '/cart/add',
        { foodId: productId, quantity },
        { headers: { 'X-Use-Token': 'user' } }
      )

      setCart(response.data)
      setItemCount(response.data.items?.length || 0)
      console.log('✅ Item added to cart')
      return response.data
    } catch (error) {
      console.error('❌ Add to cart error:', error.response?.status, error.response?.data)
      throw error
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    requireUserToken()

    const response = await API.put(
      `/cart/update/${itemId}`,
      { quantity },
      { headers: { 'X-Use-Token': 'user' } }
    )

    setCart(response.data)
    setItemCount(response.data.items?.length || 0)
    return response.data
  }

  const removeFromCart = async (itemId) => {
    requireUserToken()

    const response = await API.delete(`/cart/remove/${itemId}`, {
      headers: { 'X-Use-Token': 'user' }
    })

    setCart(response.data)
    setItemCount(response.data.items?.length || 0)
    return response.data
  }

  const clearCart = async () => {
    requireUserToken()

    await API.delete('/cart/clear', {
      headers: { 'X-Use-Token': 'user' }
    })

    setCart(null)
    setItemCount(0)
  }

  const value = {
    cart,
    loading,
    itemCount,
    getCartCount,
    getCartTotal,
    getDeliveryCharge,
    getFinalTotal,
    checkAndClearCartForDeliveredOrders,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
