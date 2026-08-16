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

// WHAT: All app routes — maps URLs to pages
// IMPORTS: pages, layouts, ProtectedRoute
// USED BY: App.tsx

import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import NotFoundPage from '../pages/error/NotFoundPage'
import UnauthorizedPage from '../pages/error/UnauthorizedPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

// zhegir-notes: why in comment right now cuz we still didnt make many pages so we will make paths in comments for now after we finish each page we will add their route
//look when we work live if theres path without page it will be errore and won't work
//dont worry i learned the syntax for routes jiwar😁👍 

// → Routes, Route (react-router-dom): the two core building blocks — Routes
//   is the container, Route is one rule. Nothing renders outside <Routes>
// → MainLayout: the only real import right now, since it's the only layout
//   piece that's actually built — it wraps all public + customer-protected
//   pages with Navbar + Footer
// → <Route element={<MainLayout />}> with no `path`: this is a LAYOUT route,
//   not a page route — it wraps whatever child <Route path="..."> sits
//   inside it, rendering them wherever <Outlet /> is placed inside MainLayout
// → all page routes are TODO comments, not real code, because none of the
//   actual page components exist yet (HomePage, LoginPage, OwnerDashboard,
//   etc. are all future Layer 3/5/6 work) — writing real <Route> tags now
//   would crash on missing imports
// → checkout + my-orders are TODO'd separately from the other public routes
//   to flag that they'll ALSO need a ProtectedRoute wrapper once that file
//   exists — same MainLayout frame, but with a login-check gate in front
// → owner/* and admin/* routes are double-nested in the TODO: ProtectedRoute
//   (role gate, checks allowedRoles) wraps DashboardLayout (Sidebar frame),
//   which wraps the actual dashboard pages — two layers of protection/framing
//   stacked, unlike the single MainLayout wrap for public pages
// → /unauthorized and "*" (404 catch-all) are TODO'd last on purpose — the
//   wildcard "*" MUST always be the last route in the file, since React
//   Router matches top to bottom and anything below it would never be reached
// → export default AppRoutes: makes this importable as <AppRoutes /> inside
//   App.tsx, which is the file that actually mounts this whole route map

/** STORY
 * routes/index.tsx is the receptionist 👩‍💼 standing at the front desk of
 * Jiwar. Right now, though, most of the building behind her isn't built
 * yet — no OwnerDashboard office, no AdminShops office, not even a proper
 * "wrong department" room (/unauthorized) or lost-and-found (404 page).
 *
 * So today, the receptionist only has ONE working hallway: MainLayout,
 * the public wing with Navbar and Footer at both ends. Every page listed
 * as a TODO is a sign taped to a door that hasn't been built — she knows
 * the door SHOULD say "/owner/dashboard → shop_admin only," and she's
 * already written the note for herself for when that room exists.
 *
 * The moment we build UnauthorizedPage and NotFoundPage (right after this),
 * she can finally point people somewhere when they wander into a room
 * they're not allowed in, or ask for a room that was never on the list.
 */