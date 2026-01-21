import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSearch, FiX, FiClock } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { productService } from '../services/productService'
import { mockProducts } from '../utils/mockData'
import { debounce } from '../utils/helpers'
import LazyImage from '../components/LazyImage'

const Search = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      // Call API for search results
      const data = await productService.searchProducts(searchTerm)
      setResults(data.products || data || [])

      // Add to recent searches
      addToRecentSearches(searchTerm)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
      setShowSuggestions(false)
    }
  }

  const debouncedSearch = debounce((term) => {
    if (term.trim()) {
      // In real app, fetch suggestions from API
      const suggestions = mockProducts
        .filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 5)
      setSuggestions(suggestions)
    } else {
      setSuggestions([])
    }
  }, 300)

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    debouncedSearch(value)
    setShowSuggestions(true)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      performSearch(searchQuery.trim())
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name)
    navigate(`/search?q=${encodeURIComponent(suggestion.name)}`)
    performSearch(suggestion.name)
  }

  const handleRecentSearchClick = (term) => {
    setSearchQuery(term)
    navigate(`/search?q=${encodeURIComponent(term)}`)
    performSearch(term)
  }

  const addToRecentSearches = (term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setResults([])
                  navigate('/search')
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {suggestions.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 px-3 py-2">Suggestions</p>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <LazyImage
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">{suggestion.quantity}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {recentSearches.length > 0 && (
                  <div className="p-2 border-t border-gray-200">
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="text-xs font-medium text-gray-500">Recent Searches</p>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <FiClock className="text-gray-400" size={18} />
                        <span className="text-gray-700">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <SkeletonLoader key={i} variant="productCard" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Found <span className="font-bold text-gray-900">{results.length}</span> products
                {query && ` for "${query}"`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-12">
            <LazyImage
              src="https://images.unsplash.com/photo-1556438064-2d7646166914?w=400"
              alt="No results"
              className="w-64 h-64 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setResults([])
                navigate('/search')
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiSearch size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search for products</h3>
            <p className="text-gray-600">
              Start typing to search for groceries, fruits, vegetables, and more
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Search


