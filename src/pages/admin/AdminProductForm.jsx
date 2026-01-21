import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiX, FiUpload } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { mockCategories } from '../../utils/adminMockData'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'

const AdminProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    quantity: '',
    description: '',
    stock: '',
    image: '',
    status: 'active',
  })

  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      // Load product data
      const mockProduct = {
        id: 1,
        name: 'Fresh Red Tomatoes',
        category: 'Fruits & Vegetables',
        price: 45,
        originalPrice: 55,
        quantity: '500g',
        description: 'Fresh, juicy red tomatoes',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
        status: 'active',
      }
      setFormData(mockProduct)
      setImagePreview(mockProduct.image)
    }
  }, [id, isEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('Please fill all required fields')
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully')
      setLoading(false)
      navigate('/admin/products')
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update product information' : 'Create a new product for your catalog'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <LazyImage
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, image: '' }))
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <FiUpload className="text-gray-400" size={32} />
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  value={formData.image && !imagePreview ? formData.image : ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }))
                    if (e.target.value) setImagePreview(e.target.value)
                  }}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Category</option>
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 500g, 1L, 1 dozen"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProductForm


