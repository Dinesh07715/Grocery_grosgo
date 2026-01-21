import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiMapPin, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useLocation as useLocationContext } from '../contexts/LocationContext'

const Header = ({ onSearch }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const { selectedLocation, detectLocation } = useLocationContext()
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (onSearch) onSearch(searchQuery.trim())
    }
  }

  const handleLocationClick = async () => {
    try {
      await detectLocation()
      setShowLocationModal(false)
    } catch (error) {
      console.error('Location detection error:', error)
      setShowLocationModal(true)
    }
  }

  const cartCount = getCartCount()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-primary-600 hidden md:block">GROGOS</span>
            </Link>

            {/* Location */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 max-w-xs"
            >
              <FiMapPin className="text-primary-600 flex-shrink-0" size={20} />
              <div className="text-left min-w-0 flex-1">
                <p className="text-xs text-gray-500 truncate">Deliver to</p>
                <p className="text-sm font-medium truncate">
                  {selectedLocation?.address || 'Select Location'}
                </p>
              </div>
              <FiChevronDown className="text-gray-400 flex-shrink-0" size={16} />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </form>

            {/* Mobile Search Icon */}
            <Link
              to="/search"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiSearch size={24} className="text-gray-700" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium hidden lg:block">{user?.name || 'User'}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select Your Location</h3>
            <div className="space-y-3">
              <button
                onClick={handleLocationClick}
                className="w-full flex items-center gap-3 p-4 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <FiMapPin className="text-primary-600" size={24} />
                <div className="text-left">
                  <p className="font-medium">Use Current Location</p>
                  <p className="text-sm text-gray-500">Detect automatically using GPS</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/addresses')}
                className="w-full flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiMapPin className="text-gray-600" size={24} />
                <div className="text-left">
                  <p className="font-medium">Select from Saved Addresses</p>
                  <p className="text-sm text-gray-500">Choose from your saved locations</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header


