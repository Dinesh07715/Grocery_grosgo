import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiPackage,
  FiFolder,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from 'react-icons/fi'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import toast from 'react-hot-toast'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin' },
    { icon: FiPackage, label: 'Products', path: '/admin/products' },
    { icon: FiFolder, label: 'Categories', path: '/admin/categories' },
    { icon: FiShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: FiUsers, label: 'Users', path: '/admin/users' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">GROGOS</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {active && <FiChevronRight className="ml-auto" size={16} />}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {admin?.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{admin?.email || 'admin@grogos.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
