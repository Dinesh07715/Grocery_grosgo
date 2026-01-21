import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlus, FiMinus, FiTruck, FiStar, FiChevronLeft } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

import SkeletonLoader from '../components/SkeletonLoader'
import { productService } from '../services/productService'
import { useCart } from '../contexts/CartContext'
//import { mockProducts } from '../utils/mockData'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, updateQuantity } = useCart()
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [id])

  useEffect(() => {
    // Set initial quantity from cart if item exists
    if (product) {
      const cartItem = cart?.items?.find(
  item => item?.food?.id === product.id || item?.foodId === product.id
)
setQuantity(cartItem?.quantity || 1)

    }
  }, [product, cart])

 const loadProduct = async () => {
  try {
    setLoading(true)

    const res = await productService.getProductById(id)

    // ✅ ADD THESE LINES HERE
    console.log('🧠 FULL PRODUCT OBJECT:', res)
    console.log('🧠 PRODUCT KEYS:', Object.keys(res))

    setProduct(res)
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    setLoading(false)
  }
}



  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    } else {
      toast.error('Maximum stock available')
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock')
      return
    }

    try {
      setAddingToCart(true)
      const cartItem =
  cart?.items?.find(item =>
    item?.food?.id === product?.id ||
    item?.foodId === product?.id ||
    item?.id === product?.id
  ) || null;

      
      if (cartItem) {
  // ✅ FIX: Replace quantity, don't add
  await updateQuantity(product.id, quantity)
} else {
  await addToCart(product.id, quantity)
}

      
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  // ✅ FIXED - Safe cart lookup
const cartItem = cart?.items?.find(item =>
  (item?.food?.id || item?.id || item?.foodId) === product?.id
) || null;

  const cartQuantity = cartItem?.quantity || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <SkeletonLoader variant="productCard" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Home
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  // ✅ BUILD IMAGE URL SAFELY
// ✅ FIX PRODUCT DETAIL IMAGE PATH - Extract filename from full URL
const imagePath = product?.imageUrl ? `/${product.imageUrl.split('/').pop()}` : '/no-image.png'




  const discount = calculateDiscount(product.originalPrice, product.price)
  // const images = [imagePath]


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiChevronLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          {/* Image Gallery */}
<div>
  <div className="bg-white rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
    <img
      src={imagePath}
      alt={product.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = '/no-image.png' // fallback from public
      }}
    />
  </div>

  <div className="flex gap-2">
    <img
      src={imagePath}
      alt={product.name}
      className="w-20 h-20 object-cover rounded-lg border"
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = '/no-image.png' // fallback from public
      }}
    />
  </div>
</div>



            {/* {images[0] && (
  <div className="flex gap-2">
    <img
      src={images[0]}
      alt={product.name}
      className="w-20 h-20 object-cover rounded-lg border"
    />
  </div>
)} */}

          

          {/* Product Info */}
          <div className="bg-white rounded-lg p-6">
            {discount > 0 && (
              <span className="inline-block bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded mb-4">
                {discount}% OFF
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 fill-yellow-400" size={20} />
                  <span className="font-medium">{product.rating}</span>
                  {product.reviews && (
                    <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                  )}
                </div>
              )}
              {product.stock > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock} in stock
                </span>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-green-600 font-medium">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">{product.quantity}</p>
            </div>

            <div className="flex items-center gap-2 mb-6 text-gray-600">
              <FiTruck size={20} />
              <span className="text-sm">
                Delivery in {product.deliveryTime || '10-15 mins'}
              </span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {product.manufacturer && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Manufacturer</h3>
                <p className="text-gray-600">{product.manufacturer}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="border-t pt-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMinus size={20} />
                    </button>
                    <span className="px-4 py-2 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock <= 0}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart
                      ? 'Adding...'
                      : cartQuantity > 0
                      ? `Update Cart (${cartQuantity})`
                      : 'Add to Cart'}
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">Out of Stock</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail


