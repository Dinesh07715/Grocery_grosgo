import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import API from "../api/api"
import ProductCard from "../components/ProductCard"

const CategoryPage = () => {
  const { category } = useParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [sortBy, setSortBy] = useState('popularity')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get('/foods')
      console.log("✅ LOADED", res.data.length, "PRODUCTS")
      setAllProducts(res.data)
    } catch (error) {
      console.error("❌ API ERROR")
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter by category
  const simpleFilter = (products, cat) => {
    if (!cat) return products
    
    console.log("🔍 Raw category from URL:", cat)
    console.log("🔍 Total products:", products.length)
    
    // Log first few products to see their structure
    if (products.length > 0) {
      console.log("📦 Sample product:", products[0])
      console.log("📦 All product categories:", products.map(p => ({
        name: p.name,
        category: p.category,
        categoryName: p.categoryName,
        cat: p.cat
      })))
    }
    
    // Convert URL category to lowercase and try multiple matching strategies
    const urlCat = cat.toLowerCase()
    
    const filtered = products.filter(product => {
      try {
        // Get all possible category fields
        const productCat = (product.category || product.categoryName || product.cat || '').toLowerCase()
        const productName = (product.name || '').toLowerCase()
        
        console.log(`Checking: ${product.name} | category field: "${productCat}" | URL: "${urlCat}"`)
        
        // Try exact match first
        if (productCat === urlCat) return true
        
        // Try partial match (category contains url or url contains category)
        if (productCat.includes(urlCat) || urlCat.includes(productCat)) return true
        
        // Try matching individual words (for "Fruits & Vegetables" -> match "fruits" or "vegetables")
        const urlWords = urlCat.split(/[\s&-]+/).filter(w => w.length > 2)
        const catWords = productCat.split(/[\s&-]+/).filter(w => w.length > 2)
        
        for (let urlWord of urlWords) {
          for (let catWord of catWords) {
            if (urlWord.includes(catWord) || catWord.includes(urlWord)) return true
          }
        }
        
        // Try matching in product name
        for (let urlWord of urlWords) {
          if (productName.includes(urlWord)) return true
        }
        
        return false
      } catch (error) {
        console.error("Filter error:", error)
        return false
      }
    })
    
    console.log("✅ Filtered products:", filtered.length)
    return filtered
  }

  // Apply all filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    // First filter by category
    let filtered = simpleFilter(allProducts, category)

    // Filter by price range
    if (minPrice !== '') {
      filtered = filtered.filter(p => (p.price || 0) >= Number(minPrice))
    }
    if (maxPrice !== '') {
      filtered = filtered.filter(p => (p.price || 0) <= Number(maxPrice))
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => (p.stock || p.inStock || 0) > 0)
    }

    // Sort products
    if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    return filtered
  }, [allProducts, category, sortBy, minPrice, maxPrice, inStockOnly])

  const clearFilters = () => {
    setSortBy('popularity')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium">
          ← Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {category || 'All Products'}
          </h1>
          <p className="text-gray-600">{filteredAndSortedProducts.length} products available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Sort By */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="₹0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Max Price */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="₹10000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* In Stock Only */}
          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="inStock"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              In Stock Only
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Debug Info */}
      {filteredAndSortedProducts.length === 0 && allProducts.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <p className="font-bold text-yellow-800">Debug: No matches found</p>
          <p>Category: <code>{category}</code></p>
          <p>Total products in database: {allProducts.length}</p>
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Clear Filters to See All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPage