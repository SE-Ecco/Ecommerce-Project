// WHAT: All URL routes mapped to page components + access control
// IMPORTS: All page components, ProtectedRoute, MainLayout, DashboardLayout
// USED BY: App.tsx
// PATTERN: Public routes → MainLayout, Protected routes → ProtectedRoute → DashboardLayout
//
// ROUTES:
//   /                              → HomePage (public)
//   /login                         → LoginPage (public)
//   /register                      → RegisterPage (public)
//   /shops/:slug/products          → ProductsPage (public)
//   /shops/:slug/products/:id      → ProductDetailPage (public)
//   /cart                          → CartPage (public)
//   /checkout                      → CheckoutPage (customer, logged in)
//   /my-orders                     → CustomerOrdersPage (customer, logged in)
//   /owner/dashboard               → OwnerDashboard (shop_admin)
//   /owner/products                → OwnerProducts (shop_admin)
//   /owner/orders                  → OwnerOrders (shop_admin)
//   /owner/categories              → OwnerCategories (shop_admin)
//   /owner/profile                 → OwnerProfile (shop_admin)
//   /admin/dashboard               → AdminDashboard (super_admin)
//   /admin/shops                   → AdminShops (super_admin)
//   /admin/users                   → AdminUsers (super_admin)
//   /unauthorized                  → UnauthorizedPage
//   *                              → NotFoundPage
