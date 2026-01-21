import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { productService } from '../services/productService'
import { getBackendCategories, getUICategoryName } from '../utils/categoryMapping'

const ProductListing = () => {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('popularity')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
  })

  useEffect(() => {
    loadProducts()
  }, [category, sortBy, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)

      // Get backend categories for the UI category
      const backendCategories = getBackendCategories(category)

      // Set category info based on UI category
      setCategoryInfo({
        name: getUICategoryName(backendCategories[0]) || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        icon: '📦' // Default icon, can be customized
      })

      // Fetch products from API for the backend categories
      // Pass all filters to backend - no client-side filtering
      let data
      if (backendCategories.length === 1) {
        data = await productService.getProductsByCategory(backendCategories[0], { sortBy, ...filters })
      } else {
        data = await productService.getProductsByCategories(backendCategories, { sortBy, ...filters })
      }

      const products = data.products || data
      setProducts(products)
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Category Header */}
        <div className="mb-6">
          {categoryInfo && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                {categoryInfo.icon ? (
                  <span className="text-4xl">{categoryInfo.icon}</span>
                ) : (
                  <img src={categoryInfo.image} alt={categoryInfo.name} className="w-full h-full object-cover rounded-full" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{categoryInfo.name}</h1>
                <p className="text-gray-600">{products.length} products available</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="₹0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="₹10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setFilters({ minPrice: '', maxPrice: '', inStock: false })}
              className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <SkeletonLoader key={i} variant="productCard" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No products found in this category</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductListing


