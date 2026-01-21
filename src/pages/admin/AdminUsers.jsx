import { useState, useEffect } from 'react'
import { FiSearch, FiX, FiCheck } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import adminApi from '../../api/adminApi'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updatingUserId, setUpdatingUserId] = useState(null)

  // 🔹 Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log('📡 Admin: fetching users')

      const res = await adminApi.get('/users')
      setUsers(res.data)

      console.log(`✅ Loaded ${res.data.length} users`)
    } catch (error) {
      console.error('❌ Load users error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Toggle user status
  const handleToggleStatus = async (userId) => {
    if (!userId) return

    const user = users.find(u => u.id === userId)
    if (!user) return

    const newStatus = user.status === 'active' ? 'blocked' : 'active'

    try {
      setUpdatingUserId(userId)
      console.log(`🔄 Updating user ${userId} → ${newStatus}`)

      await adminApi.put(`/users/${userId}/status`, {
        status: newStatus,
      })

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, status: newStatus } : u
        )
      )

      toast.success(
        `User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`
      )
    } catch (error) {
      console.error('❌ Toggle status error:', error)
      toast.error('Failed to update user status')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.includes(q)

    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3">Spent</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.orders?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formatPrice(
                        user.orders?.reduce(
                          (sum, o) => sum + (o.totalAmount || 0),
                          0
                        ) || 0
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={updatingUserId === user.id}
                        className="text-sm flex items-center gap-1"
                      >
                        {user.status === 'active' ? <FiX /> : <FiCheck />}
                        {user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
