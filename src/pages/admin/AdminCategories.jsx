import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'
import adminApi from '../../api/adminApi'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    image: '',
    status: 'active',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      // Fetch categories from admin API endpoint
      const res = await adminApi.get('/categories')
      const categoriesData = res.data || []
      
      console.log('📦 Categories from API:', categoriesData) // Debug
      
      // Fetch products to count items per category
      const productsRes = await adminApi.get('/products')
      const products = productsRes.data || []
      
      console.log('🍎 Products from API:', products) // Debug
      
      const formattedCategories = categoriesData.map(cat => {
        const productCount = products.filter(p => p.category === cat.name).length
        return {
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '📦',
          image: cat.image || '',
          productCount: productCount,
          status: cat.status || 'active',
        }
      })
      
      console.log('✅ Formatted categories:', formattedCategories) // Debug
      setCategories(formattedCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error('Please enter category name')
      return
    }

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, ...formData } : cat
      ))
      toast.success('Category updated successfully')
    } else {
      const newCategory = {
        
        ...formData,
        productCount: 0,
      }
      setCategories([...categories, newCategory])
      toast.success('Category created successfully')
    }
    setShowForm(false)
    setEditingCategory(null)
    setFormData({ name: '', icon: '', image: '', status: 'active' })
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon || '',
      image: category.image || '',
      status: category.status || 'active',
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    setCategories(categories.filter(cat => cat.id !== id))
    toast.success('Category deleted successfully')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage product categories</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingCategory(null)
              setFormData({ name: '', icon: '', image: '', status: 'active' })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <FiPlus size={20} />
            Add Category
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🥬"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No categories found</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <span className="text-3xl">{category.icon}</span>
                    )}
                    {category.image && !category.icon && (
                      <LazyImage
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    {!category.icon && !category.image && (
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiImage className="text-primary-600" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.productCount || 0} products</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.status}
                  </span>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCategories


