// WHAT: All app routes — maps URLs to pages
// IMPORTS: all pages, layouts, ProtectedRoute
// USED BY: App.tsx

import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'

// auth
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// shop
import HomePage from '../pages/shop/HomePage'
import ProductsPage from '../pages/shop/ProductsPage'
import ProductDetailPage from '../pages/shop/ProductDetailPage'

// cart + checkout
import CartPage from '../pages/cart/CartPage'
import CheckoutPage from '../pages/checkout/CheckoutPage'

// customer
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage'
import WishlistPage from '../pages/customer/WishlistPage'
import AddressPage from '../pages/customer/AddressPage'

// owner
import OwnerDashboard from '../pages/owner/OwnerDashboard'
import OwnerProducts from '../pages/owner/OwnerProducts'
import OwnerOrders from '../pages/owner/OwnerOrders'
import OwnerCategories from '../pages/owner/OwnerCategories'
import OwnerProfile from '../pages/owner/OwnerProfile'
import OwnerSettings from '../pages/owner/OwnerSetting'
import OwnerShipping from '../pages/owner/OwnerShipping'

// admin
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminShops from '../pages/admin/AdminShops'
import AdminUsers from '../pages/admin/AdminUsers'

// error
import NotFoundPage from '../pages/error/NotFoundPage'
import UnauthorizedPage from '../pages/error/UnauthorizedPage'

const AppRoutes = () => {
  return (
    <Routes>

      {/* public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shops/:slug/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* customer routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<CustomerOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/addresses" element={<AddressPage />} />
        </Route>
      </Route>

      {/* owner routes */}
      <Route element={<ProtectedRoute allowedRoles={['shop_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/products" element={<OwnerProducts />} />
          <Route path="/owner/orders" element={<OwnerOrders />} />
          <Route path="/owner/categories" element={<OwnerCategories />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
          <Route path="/owner/shipping" element={<OwnerShipping />} />
        </Route>
      </Route>

      {/* admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/shops" element={<AdminShops />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default AppRoutes