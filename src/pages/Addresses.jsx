import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiCheck, FiHome, FiBriefcase } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation as useLocationContext } from '../contexts/LocationContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import LazyImage from '../components/LazyImage'

const Addresses = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addresses, saveAddress, deleteAddress, detectLocation } = useLocationContext()
  
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    lat: null,
    lng: null,
    isDefault: false,
  })

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type || 'Home',
      name: address.name || user?.name || '',
      phone: address.phone || user?.phone || '',
      address: address.address || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      lat: address.lat || null,
      lng: address.lng || null,
      isDefault: address.isDefault || false,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      if (editingAddress) {
        // Update existing address
        // In real app, call API to update
        toast.success('Address updated successfully')
      } else {
        await saveAddress(formData)
      }
      
      setShowForm(false)
      setEditingAddress(null)
      setFormData({
        type: 'Home',
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        lat: null,
        lng: null,
        isDefault: false,
      })
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      await deleteAddress(addressId)
      toast.success('Address deleted successfully')
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }

  const handleUseCurrentLocation = async () => {
    try {
      const location = await detectLocation()
      setFormData({
        ...formData,
        lat: location.lat,
        lng: location.lng,
        address: location.address || formData.address,
      })
      toast.success('Location detected successfully')
    } catch (error) {
      toast.error('Failed to detect location. Please enter manually.')
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Home':
        return <FiHome size={20} />
      case 'Work':
        return <FiBriefcase size={20} />
      default:
        return <FiMapPin size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Addresses</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingAddress(null)
              setFormData({
                type: 'Home',
                name: user?.name || '',
                phone: user?.phone || '',
                address: '',
                landmark: '',
                city: '',
                state: '',
                pincode: '',
                lat: null,
                lng: null,
                isDefault: false,
              })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <FiPlus size={20} />
            Add New Address
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingAddress(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Near..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  maxLength={10}
                />
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <FiMapPin size={18} />
                Use Current Location
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  id="default"
                />
                <label htmlFor="default" className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAddress(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <LazyImage
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
              alt="No Addresses"
              className="w-64 h-64 mx-auto mb-6 rounded-lg"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Saved Addresses</h2>
            <p className="text-gray-600 mb-6">
              Add an address to make checkout faster
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <FiPlus size={20} />
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
                  address.isDefault ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-primary-600">{getTypeIcon(address.type)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{address.name || 'User'}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {address.type}
                        </span>
                      </div>
                      {address.phone && (
                        <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-1">{address.address}</p>
                  {address.landmark && (
                    <p className="text-sm text-gray-600">Near {address.landmark}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Addresses


