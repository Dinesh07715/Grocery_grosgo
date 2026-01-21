import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import LazyImage from '../../components/LazyImage'
import adminApi from '../../api/adminApi'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Fetch from admin products API endpoint
      const res = await adminApi.get('/products')
      const foodsData = res.data || []
      
      // Transform database format to display format
      const formattedProducts = foodsData.map(food => ({
        id: food.id,
        name: food.name,
        category: food.category,
        price: food.price,
        originalPrice: food.price,
        quantity: '1 unit',
        image: `/${(food.imageUrl || '').split('/').pop()}` || '/no-image.png',
        stock: food.stock || 0,
        status: food.status || 'AVAILABLE',
        rating: 4.5,
        reviews: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }))
      
      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    setProducts(products.filter(p => p.id !== id))
    toast.success('Product deleted successfully')
  }

  const handleToggleStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
    toast.success('Product status updated')
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <FiPlus size={20} />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <LazyImage
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.quantity}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                        {product.originalPrice > product.price && (
                          <div className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.stock > 20 ? 'text-green-600' : 
                          product.stock > 10 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {product.status === 'active' ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts


