import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LocationProvider } from './contexts/LocationContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import OTPVerification from './pages/Auth/OTPVerification'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Addresses from './pages/Addresses'
import Search from './pages/Search'
import OrderDetails from "./pages/OrderDetails"
import CategoryPage from "./pages/CategoryPage"

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <AdminAuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route path="/otp-verify" element={<OTPVerification />} /> */}
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* ✅ FIXED: Added /admin/dashboard route that points to same component */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/products" element={
                  <AdminProtectedRoute>
                    <AdminProducts />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/products/new" element={
                  <AdminProtectedRoute>
                    <AdminProductForm />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/products/:id/edit" element={
                  <AdminProtectedRoute>
                    <AdminProductForm />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <AdminProtectedRoute>
                    <AdminCategories />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminProtectedRoute>
                    <AdminOrders />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/orders/:id" element={
                  <AdminProtectedRoute>
                    <AdminOrderDetail />
                  </AdminProtectedRoute>
                } />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } />
                
                {/* Product listing for category clicks */}
                <Route path="/products/:category" element={
                  <ProtectedRoute>
                    <ProductListing />
                  </ProtectedRoute>
                } />
                
                <Route path="/product/:id" element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/order-success/:orderId" element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/addresses" element={
                  <ProtectedRoute>
                    <Addresses />
                  </ProtectedRoute>
                } />
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AdminAuthProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App