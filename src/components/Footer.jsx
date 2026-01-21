import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-white">GROGOS</span>
            </div>
            <p className="text-sm mb-4">
              Instant grocery delivery at your doorstep. Fresh products delivered fast.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-primary-400 transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-primary-400 transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold mb-4">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-400 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-primary-400 transition-colors">
                  Addresses
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-primary-400 transition-colors">
                  Wallet
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-sm">
          <p>&copy; {currentYear} GROGOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


