// WHAT: All fixed values used across the whole frontend in one place
// IMPORTS: Nothing
// USED BY: services/api.ts, store/authStore.ts, pages, components
// CONTAINS:
//   API_BASE_URL         — backend URL
//   AUTH_TOKEN_KEY        — localStorage key for JWT
//   ROLES                — { SUPER_ADMIN: 'super_admin', SHOP_ADMIN: 'shop_admin', CUSTOMER: 'customer' }
//   ORDER_STATUS         — { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
//   PRODUCT_CATEGORIES   — default category list
export const API_BASE_URL = 'http://localhost:5000/api'

export const ROLES = {
  CUSTOMER: 'customer',
  SHOP_ADMIN: 'shop_admin',
  SUPER_ADMIN: 'super_admin',
}
export const AUTH_TOKEN_KEY = 'token';

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

//this list product category we will add names to is future-if you explanation call zhegir
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',]


  //zhegir notes
// ─────────────────────────────────────────────
// API_BASE_URL        → backend URL, used by services/api.ts to build every request
// AUTH_TOKEN_KEY       → localStorage key name for the JWT, used in api.ts's interceptor
// ROLES                → matches User type's role field, used in ProtectedRoute.tsx + Sidebar.tsx for access checks
// ORDER_STATUS         → order lifecycle stages, used in OrderStatus.tsx + TenantOrders.tsx
// PRODUCT_CATEGORIES   → default category list, used as fallback in ProductForm.tsx dropdown

// ─────────────────────────────────────────────
// 🌐 API_BASE_URL
// Story: the backend moves servers one day, URL changes from localhost to a live domain.
// Instead of hunting through every service file, you change ONE line here. Done. ✅

// 🔑 AUTH_TOKEN_KEY
// Story: two teammates each write "token" and "authToken" by hand in different files.
// The interceptor looks for one, login saves the other — user gets logged out randomly.
// One shared constant means everyone reaches into the SAME drawer. 🗄️

// 👤 ROLES
// Story: a customer somehow lands on the shop owner's dashboard because someone typed
// "Shop_Admin" instead of "shop_admin" in an if-check. Silent bug, hard to catch.
// With ROLES.SHOP_ADMIN, autocomplete + TypeScript catch the typo before it ships. 🛡️

// 📦 ORDER_STATUS
// Story: a shop owner marks an order "Shipped" on one page and "shipped " (extra space)
// on another — now the customer's order tracker never shows it as shipped.
// One shared list of exact stage names keeps every screen speaking the same language. 🚚

// 🏷️ PRODUCT_CATEGORIES
// Story: backend categories haven't been built yet, but the product form still needs
// SOMETHING in its dropdown so you can keep building and testing today.
// This is the placeholder shelf label until real categories arrive from the database. 🏪
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 🌐 API_BASE_URL
// The web address of the backend server. Every API call (login, get products, place order)
// gets built by attaching a path to this base address.

// 🔑 AUTH_TOKEN_KEY
// The exact name used to save/read the JWT token inside the browser's localStorage.
// Anywhere the code needs to store or fetch the token, it uses this name so it's always consistent.

// 👤 ROLES
// The 3 fixed user types in the system. Used to check "what is this logged-in user allowed to see/do"
// — for example, blocking a customer from reaching the shop owner's dashboard.

// 📦 ORDER_STATUS
// The fixed set of stages an order passes through, from placed to delivered (or cancelled).
// Used to update and display where an order currently stands.

// 🏷️ PRODUCT_CATEGORIES
// A starting list of category names products can belong to, used in the product form's
// dropdown until real categories are fetched from the database.
// 
