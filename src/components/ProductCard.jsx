import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import LazyImage from './LazyImage'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart()
  const [loading, setLoading] = useState(false)
  
  // Handle cart being null, object, or array
  const cartItems = Array.isArray(cart) ? cart : (cart?.items || [])
  const cartItem = cartItems.find((item) => item.food?.id === product.id)
  const quantity = cartItem?.quantity || 0

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock')
      return
    }
    
    try {
      setLoading(true)
      if (quantity === 0) {
        await addToCart(product.id, 1)
      } else {
        await updateQuantity(product.id, quantity + 1)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = async () => {
    if (product.stock <= quantity) {
      toast.error('Maximum stock available')
      return
    }
    
    try {
      setLoading(true)
      await updateQuantity(product.id, quantity + 1)
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDecrement = async () => {
    try {
      setLoading(true)
      await updateQuantity(product.id, quantity - 1)
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const discount = calculateDiscount(product.originalPrice, product.price)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10
  console.log("🧾 PRODUCT DATA:", product);


  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">Out of Stock</span>
        </div>
      )}

      {/* Low Stock Badge */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
          Only {product.stock} left
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
          {discount}% OFF
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
  <img
    src={`/${product.imageUrl?.split('/').pop()}`}
    alt={product.name}
    onError={(e) => (e.target.src = "/no-image.png")}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
</div>



        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{product.quantity}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm text-gray-600">{product.rating}</span>
              {product.reviews && (
                <span className="text-xs text-gray-400">({product.reviews})</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || loading}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-primary-50 rounded-lg p-2">
            <button
              onClick={handleDecrement}
              disabled={loading}
              className="p-2 bg-white rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
            >
              <FiMinus size={18} className="text-primary-600" />
            </button>
            <span className="flex-1 text-center font-bold text-primary-600">{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={loading || product.stock <= quantity}
              className="p-2 bg-white rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={18} className="text-primary-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard


