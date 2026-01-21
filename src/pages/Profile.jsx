import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
} from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useLocation as useLocationContext } from '../contexts/LocationContext'
import { getInitials } from '../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../components/LazyImage'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()
  const { addresses } = useLocationContext()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleEdit = () => {
    setEditing(true)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
  }

  const handleSave = async () => {
    try {
      // In real app, update via API
      // await userService.updateProfile(formData)
      
      updateUser({ ...user, ...formData })
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const menuItems = [
    {
      icon: <FiPackage size={20} />,
      label: 'My Orders',
      link: '/orders',
      count: null,
    },
    {
      icon: <FiMapPin size={20} />,
      label: 'Saved Addresses',
      link: '/addresses',
      count: addresses.length,
    },
    {
      icon: <FiHeart size={20} />,
      label: 'Wishlist',
      link: '/wishlist',
      count: 0,
    },
    {
      icon: <FiHelpCircle size={20} />,
      label: 'Help & Support',
      link: '/help',
      count: null,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.avatar ? (
                    <LazyImage
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {getInitials(user?.name || 'User')}
                    </span>
                  )}
                </div>
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-medium"
                      placeholder="Name"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-1 mx-auto text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <FiEdit2 size={14} />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>

              {editing && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <FiCheck size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!editing && (
                <div className="space-y-2 text-sm">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMail size={16} />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPhone size={16} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary-600 group-hover:text-primary-700">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className="text-sm text-gray-500">({item.count})</span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="border-t mt-6 pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-lg hover:bg-red-50 transition-colors group"
                >
                  <FiLogOut className="text-red-600 group-hover:text-red-700" size={20} />
                  <span className="font-medium text-red-600 group-hover:text-red-700">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Profile


