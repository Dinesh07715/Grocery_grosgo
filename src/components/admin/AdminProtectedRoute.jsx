// src/components/admin/AdminProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'  // Fixed: was ../contexts, now ../../contexts

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Don't clear user data - just redirect
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute