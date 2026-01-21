import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import ProductCard from './ProductCard'
import SkeletonLoader from './SkeletonLoader'

const ProductSection = ({ title, products = [], category, loading = false }) => {
  if (loading) {
    return (
      <div className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} variant="productCard" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  const categorySlug = category?.toLowerCase().replace(/\s+/g, '-') || 'products'

  return (
    <div className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          {category && (
            <Link
              to={`/products/${categorySlug}`}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All
              <FiChevronRight size={18} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSection


