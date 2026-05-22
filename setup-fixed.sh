#!/bin/bash
# ============================================================
# 🛒 DUHOK E-COMMERCE — COMPLETE PROJECT SETUP (FIXED VERSION)
# ============================================================
# FIXES FROM ORIGINAL:
#   ✅ order_items table added (was missing)
#   ✅ Hybrid role system: super_admin / shop_admin / customer
#   ✅ Column names match team agreement (full_name, phone, is_available, address)
#   ✅ Category API added (controller, service, routes, validation)
#   ✅ Role authorization middleware added
#   ✅ Missing frontend services added (categoryService, userService)
#   ✅ Missing pages added (CustomerOrdersPage, OwnerProfile)
#   ✅ MUI theme file added
#   ✅ Pagination component added
#   ✅ tsconfig.node.json added
#   ✅ All seeders added (categories, products, orders, order_items)
#   ✅ dev branch created
#   ✅ Team names corrected (Zhegr + Rasheed + Ahmed)
#   ✅ No duplicate models confusion
#   ✅ Rate limiter middleware added
# ============================================================
# HOW TO USE:
#   1. Clone your empty GitHub repo
#   2. Put this file inside it
#   3. Run: bash setup-fixed.sh
# ============================================================

set -e
GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${BLUE}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo ""
echo "🛒 ================================================"
echo "   DUHOK MULTI-TENANT E-COMMERCE — FIXED SETUP"
echo "================================================ 🛒"
echo ""

# ============================================================
# ROOT FILES
# ============================================================
log "Creating root files..."

cat > pnpm-workspace.yaml << 'EOF'
# WHAT: Links frontend, backend, database as one monorepo
# WHY: pnpm install at root installs ALL at once
packages:
  - 'frontend'
  - 'backend'
  - 'database'
EOF

cat > package.json << 'EOF'
{
  "name": "duhok-ecommerce",
  "version": "1.0.0",
  "description": "Multi-tenant e-commerce for Duhok shops",
  "private": true,
  "scripts": {
    "dev":           "concurrently \"pnpm --filter frontend dev\" \"pnpm --filter backend dev\"",
    "dev:frontend":  "pnpm --filter frontend dev",
    "dev:backend":   "pnpm --filter backend dev",
    "build":         "pnpm --filter frontend build && pnpm --filter backend build",
    "migrate":       "pnpm --filter database migrate",
    "migrate:undo":  "pnpm --filter database migrate:undo",
    "seed":          "pnpm --filter database seed",
    "seed:undo":     "pnpm --filter database seed:undo"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

cat > .gitignore << 'EOF'
# Dependencies — never push these (huge!)
node_modules/
.pnpm-store/

# Environment files — NEVER push (contain secrets!)
.env
.env.local
.env.production

# Build output
dist/
build/

# Logs
*.log

# TypeScript cache
*.tsbuildinfo

# OS
.DS_Store
Thumbs.db
EOF

cat > README.md << 'EOF'
# 🛒 Duhok Multi-Tenant E-Commerce

Multi-tenant platform — many shops, one system.

## 🚀 Quick Start
```bash
pnpm install          # install all
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp database/.env.example database/.env
pnpm dev              # run frontend + backend together
```

## 📁 Structure
| Folder     | Who works here              | Tech |
|------------|-----------------------------|------|
| frontend/  | Zhegr + Rasheed + Ahmed     | React + TS + Vite |
| backend/   | Jiwar + Alan                | Node + Express + TS |
| database/  | Dlawar + Obaida + Khalil    | Sequelize CLI + PostgreSQL |
| docs/      | Everyone                    | Markdown |
| tests/     | Everyone                    | Jest + Playwright |

## 🏪 Multi-Tenant
Every shop is identified by a unique slug:
- duhok-market.com/shops/zaytoon-store
- duhok-market.com/shops/duhok-electronics

## 👥 Roles (Hybrid System)
| Role        | Access |
|-------------|--------|
| super_admin | All shops, all users, platform management |
| shop_admin  | Only their shop's products, orders, categories |
| customer    | Browse any shop, add to cart, place orders |

## 🗄️ Database Tables (6 tables)
| Table       | Description |
|-------------|-------------|
| shops       | One row per shop (tenant) |
| users       | All users (super_admin, shop_admin, customer) |
| categories  | Product categories per shop |
| products    | Products linked to shop + category |
| orders      | Customer orders with delivery address |
| order_items | Individual items in each order |
EOF

ok "Root files created!"


# ============================================================
# FRONTEND
# ============================================================
log "Setting up Frontend..."

pnpm create vite@latest frontend -- --template react-ts
cd frontend

# Install packages
pnpm add axios react-router-dom zustand @mui/material @mui/icons-material \
  @emotion/react @emotion/styled tailwindcss @tailwindcss/vite \
  formik yup framer-motion

pnpm add -D eslint prettier @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks \
  eslint-config-prettier @types/node

# Create folders
mkdir -p src/assets/{images,icons,fonts}
mkdir -p src/components/{common,layout,auth,product,cart,order,category}
mkdir -p src/pages/{auth,shop,cart,checkout,owner,admin,customer,error}
mkdir -p src/store src/hooks src/services src/types src/validations src/utils src/routes src/styles src/config src/theme

# ── Config files ──────────────────────────────────────────────
cat > vite.config.ts << 'EOF'
// WHAT: Build tool config — compiles React+TS, serves in dev, proxies API calls
// USED BY: pnpm dev (runs this automatically)
// KEY SETTINGS: @tailwind/vite plugin, @ alias for src/, proxy /api → backend
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3000, proxy: { '/api': 'http://localhost:5000' } }
})
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020", "useDefineForClassFields": true,
    "lib": ["ES2020","DOM","DOM.Iterable"], "module": "ESNext",
    "skipLibCheck": true, "moduleResolution": "bundler",
    "allowImportingTsExtensions": true, "resolveJsonModule": true,
    "isolatedModules": true, "noEmit": true, "jsx": "react-jsx",
    "strict": true, "noUnusedLocals": true, "noUnusedParameters": true,
    "baseUrl": ".", "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

cat > .env.example << 'EOF'
# WHAT: Frontend environment variables
# COPY THIS: cp .env.example .env — then fill values
# NEVER push .env to GitHub!

VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
EOF

cat > vercel.json << 'EOF'
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
EOF

cat > .prettierrc << 'EOF'
{ "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5", "printWidth": 100 }
EOF

cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true, env: { browser: true, es2020: true },
  extends: ['eslint:recommended','plugin:@typescript-eslint/recommended','plugin:react-hooks/recommended','prettier'],
  parser: '@typescript-eslint/parser',
  rules: { 'no-unused-vars': 'off', '@typescript-eslint/no-unused-vars': 'warn', '@typescript-eslint/no-explicit-any': 'warn' }
}
EOF

# ── Source files ──────────────────────────────────────────────
cat > src/styles/global.css << 'EOF'
/* WHAT: Global styles — applied to the whole app
   IMPORTS: tailwindcss (all utility classes come from here)
   USED BY: main.tsx imports this once */
@import "tailwindcss";
EOF

cat > src/main.tsx << 'EOF'
// WHAT: Entry point — mounts React app into index.html <div id="root">
// IMPORTS: App.tsx, global.css
// USED BY: Nothing — this is where everything starts
EOF

cat > src/App.tsx << 'EOF'
// WHAT: Root component — wraps everything in MUI theme + React Router
// IMPORTS: routes/index.tsx, theme/index.ts, MUI ThemeProvider
// USED BY: main.tsx
EOF

# ── Theme ──────────────────────────────────────────────────
cat > src/theme/index.ts << 'EOF'
// WHAT: MUI theme configuration — colors, typography, component overrides
// IMPORTS: @mui/material (createTheme)
// USED BY: App.tsx (ThemeProvider)
// CONTAINS: primary/secondary colors, typography (font family), component defaults
// CUSTOMIZE: Change colors here to match your brand — affects entire app
EOF

cat > src/config/constants.ts << 'EOF'
// WHAT: All fixed values used across the whole frontend in one place
// IMPORTS: Nothing
// USED BY: services/api.ts, store/authStore.ts, pages, components
// CONTAINS:
//   API_BASE_URL         — backend URL
//   AUTH_TOKEN_KEY        — localStorage key for JWT
//   ROLES                — { SUPER_ADMIN: 'super_admin', SHOP_ADMIN: 'shop_admin', CUSTOMER: 'customer' }
//   ORDER_STATUS         — { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
//   PRODUCT_CATEGORIES   — default category list
EOF

cat > src/types/index.ts << 'EOF'
// WHAT: TypeScript interfaces — the shape of every data object
// IMPORTS: Nothing
// USED BY: EVERY file that deals with data (services, stores, pages, components)
// CONTAINS:
//
//   User     → id, shop_id, full_name, email, phone, role, created_at
//   Shop     → id, name, slug, description, logo_url, is_active, created_at
//   Category → id, shop_id, name, created_at
//   Product  → id, shop_id, category_id, name, description, price, stock, image_url, is_available, created_at
//   Order    → id, shop_id, user_id, total_price, status, address, created_at, items?: OrderItem[]
//   OrderItem → id, shop_id, order_id, product_id, quantity, unit_price, product?: Product
//   CartItem → product: Product, quantity: number
//   ApiResponse<T> → success, message, data: T
//   PaginatedResponse<T> → data: T[], total, page, limit, totalPages
EOF

cat > src/routes/index.tsx << 'EOF'
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
EOF

# ── Services ──────────────────────────────────────────────
cat > src/services/api.ts << 'EOF'
// WHAT: Configured Axios instance — base for ALL API calls
// IMPORTS: config/constants.ts (API_BASE_URL, AUTH_TOKEN_KEY)
// USED BY: authService, productService, orderService, shopService, categoryService, userService
// KEY: Auto-attaches JWT token to every request. Redirects to /login on 401.
EOF

cat > src/services/authService.ts << 'EOF'
// WHAT: API calls for authentication
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/auth/LoginPage.tsx, pages/auth/RegisterPage.tsx, hooks/useAuth.ts
// ENDPOINTS: POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
EOF

cat > src/services/productService.ts << 'EOF'
// WHAT: API calls for products
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/shop/ProductsPage, pages/shop/ProductDetailPage, pages/owner/OwnerProducts
// ENDPOINTS: GET /api/shops/:slug/products, GET /api/products/:id, POST/PUT/DELETE /api/products
EOF

cat > src/services/orderService.ts << 'EOF'
// WHAT: API calls for orders
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/checkout/CheckoutPage, pages/owner/OwnerOrders, pages/customer/CustomerOrdersPage
// ENDPOINTS: POST /api/orders, GET /api/orders/my-orders, GET /api/orders/shop, PATCH /api/orders/:id/status
EOF

cat > src/services/shopService.ts << 'EOF'
// WHAT: API calls for shops (tenants)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/shop/HomePage, pages/admin/AdminShops, pages/owner/OwnerProfile
// ENDPOINTS: GET /api/shops, GET /api/shops/slug/:slug, POST/PATCH /api/admin/shops
EOF

cat > src/services/categoryService.ts << 'EOF'
// WHAT: API calls for categories (per shop)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/owner/OwnerCategories, components/product/ProductForm (category dropdown)
// ENDPOINTS:
//   GET    /api/shops/:shopId/categories      → list categories for a shop
//   POST   /api/categories                    → create category (shop_admin)
//   PUT    /api/categories/:id                → update category (shop_admin)
//   DELETE /api/categories/:id                → delete category (shop_admin)
EOF

cat > src/services/userService.ts << 'EOF'
// WHAT: API calls for user management (admin)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/admin/AdminUsers
// ENDPOINTS:
//   GET    /api/admin/users                   → list all users (super_admin)
//   PATCH  /api/admin/users/:id/role          → change user role (super_admin)
//   DELETE /api/admin/users/:id               → delete user (super_admin)
EOF

# ── Stores ──────────────────────────────────────────────
cat > src/store/authStore.ts << 'EOF'
// WHAT: Global auth state — logged in user + token, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts, config/constants.ts
// USED BY: hooks/useAuth.ts (which is used by every component that needs user info)
// CONTAINS: user, token, isAuthenticated, setAuth(), logout()
EOF

cat > src/store/cartStore.ts << 'EOF'
// WHAT: Global cart state — items list, total, shop context, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts
// USED BY: hooks/useCart.ts
// CONTAINS: items[], shopId, addItem(), removeItem(), updateQuantity(), clearCart()
// ⚠️ Cart is always tied to ONE shop — adding from a different shop clears the cart
EOF

cat > src/store/shopStore.ts << 'EOF'
// WHAT: Tracks the currently viewed shop
// IMPORTS: zustand, types/index.ts
// USED BY: hooks/useShop.ts
// CONTAINS: currentShop, setShop(), clearShop()
EOF

# ── Hooks ──────────────────────────────────────────────
cat > src/hooks/useAuth.ts << 'EOF'
// WHAT: Simplifies reading auth state + role checks
// IMPORTS: store/authStore.ts
// USED BY: components/auth/ProtectedRoute, pages/*, components/layout/Navbar, Sidebar
// RETURNS: user, isAuthenticated, isCustomer, isShopAdmin, isSuperAdmin, setAuth, logout
EOF

cat > src/hooks/useCart.ts << 'EOF'
// WHAT: Simplifies reading cart state + computed values
// IMPORTS: store/cartStore.ts
// USED BY: components/cart/CartDrawer, CartItem, pages/cart/CartPage, layout/Navbar
// RETURNS: items, totalItems, totalPrice, isEmpty, addItem, removeItem, updateQuantity, clearCart
EOF

cat > src/hooks/useShop.ts << 'EOF'
// WHAT: Simplifies reading the currently viewed shop
// IMPORTS: store/shopStore.ts
// USED BY: pages/shop/ProductsPage, components/layout/Navbar
// RETURNS: currentShop, setShop, clearShop, isLoaded
EOF

# ── Validations ──────────────────────────────────────────────
cat > src/validations/authValidation.ts << 'EOF'
// WHAT: Yup schemas — validation rules for login and register forms
// IMPORTS: yup
// USED BY: pages/auth/LoginPage.tsx, pages/auth/RegisterPage.tsx (via Formik)
// CONTAINS: loginSchema (email, password), registerSchema (full_name, email, phone, password, confirmPassword)
EOF

cat > src/validations/productValidation.ts << 'EOF'
// WHAT: Yup schemas — validation rules for product create/edit form
// IMPORTS: yup
// USED BY: components/product/ProductForm.tsx (via Formik)
// CONTAINS: productSchema (name, description, price, stock, category_id)
EOF

cat > src/validations/orderValidation.ts << 'EOF'
// WHAT: Yup schemas — validation rules for checkout form
// IMPORTS: yup
// USED BY: pages/checkout/CheckoutPage.tsx (via Formik)
// CONTAINS: checkoutSchema (address — required, min length)
EOF

cat > src/validations/categoryValidation.ts << 'EOF'
// WHAT: Yup schemas — validation rules for category create/edit
// IMPORTS: yup
// USED BY: pages/owner/OwnerCategories.tsx (via Formik)
// CONTAINS: categorySchema (name — required, min 2 chars)
EOF

# ── Utils ──────────────────────────────────────────────
cat > src/utils/helpers.ts << 'EOF'
// WHAT: Small reusable utility functions
// IMPORTS: Nothing (pure functions)
// USED BY: Any page or component that needs formatting
// CONTAINS: formatPrice(), formatDate(), truncateText(), getStatusColor(), getCloudinaryUrl()
EOF

# ── Components: Common ──────────────────────────────────────
cat > src/components/common/Button.tsx << 'EOF'
// WHAT: Reusable styled button (wraps MUI Button with project theme)
// IMPORTS: @mui/material
// USED BY: Every page and form in the project
EOF

cat > src/components/common/Input.tsx << 'EOF'
// WHAT: Reusable form input (wraps MUI TextField)
// IMPORTS: @mui/material
// USED BY: Login form, Register form, Product form
EOF

cat > src/components/common/Modal.tsx << 'EOF'
// WHAT: Reusable popup modal (wraps MUI Dialog)
// IMPORTS: @mui/material
// USED BY: pages/owner/OwnerProducts (add product), admin pages
EOF

cat > src/components/common/Spinner.tsx << 'EOF'
// WHAT: Loading spinner — shown while waiting for API responses
// IMPORTS: @mui/material (CircularProgress)
// USED BY: Any page while data is loading
EOF

cat > src/components/common/Pagination.tsx << 'EOF'
// WHAT: Reusable pagination component for lists
// IMPORTS: @mui/material (Pagination)
// USED BY: ProductsPage, OwnerProducts, OwnerOrders, AdminUsers, CustomerOrdersPage
// PROPS: currentPage, totalPages, onPageChange
EOF

cat > src/components/common/SearchBar.tsx << 'EOF'
// WHAT: Reusable search input with debounce
// IMPORTS: @mui/material (TextField, InputAdornment), @mui/icons-material (Search)
// USED BY: ProductsPage (search products), AdminUsers (search users)
// PROPS: placeholder, value, onChange, debounceMs (default 300)
EOF

cat > src/components/common/index.ts << 'EOF'
// WHAT: Barrel export — import all common components from one line
// EXAMPLE: import { Button, Spinner, Modal, Pagination, SearchBar } from '@/components/common'
EOF

# ── Components: Layout ──────────────────────────────────────
cat > src/components/layout/MainLayout.tsx << 'EOF'
// WHAT: Wraps all customer-facing pages — adds Navbar on top + Footer on bottom
// IMPORTS: Navbar.tsx, Footer.tsx, react-router-dom (Outlet)
// USED BY: routes/index.tsx (for public shop routes)
// <Outlet /> is where the page content renders
EOF

cat > src/components/layout/DashboardLayout.tsx << 'EOF'
// WHAT: Wraps all dashboard pages — adds Sidebar on left + content on right
// IMPORTS: Sidebar.tsx, react-router-dom (Outlet)
// USED BY: routes/index.tsx (for shop_admin + super_admin routes)
EOF

cat > src/components/layout/Navbar.tsx << 'EOF'
// WHAT: Top navigation bar — logo, shop name, cart icon with count, user menu
// IMPORTS: hooks/useAuth, hooks/useCart, react-router-dom, @mui/material, framer-motion
// USED BY: MainLayout.tsx
EOF

cat > src/components/layout/Footer.tsx << 'EOF'
// WHAT: Bottom footer — copyright, links
// IMPORTS: @mui/material
// USED BY: MainLayout.tsx
EOF

cat > src/components/layout/Sidebar.tsx << 'EOF'
// WHAT: Dashboard sidebar — different menu items based on user role
// IMPORTS: hooks/useAuth, react-router-dom, @mui/material, @mui/icons-material
// USED BY: DashboardLayout.tsx
// SHOWS:
//   shop_admin menu:  Dashboard, Products, Categories, Orders, Profile
//   super_admin menu: Dashboard, All Shops, All Users
EOF

# ── Components: Auth ──────────────────────────────────────
cat > src/components/auth/ProtectedRoute.tsx << 'EOF'
// WHAT: Guards routes — redirects if not logged in or wrong role
// IMPORTS: hooks/useAuth, react-router-dom (Navigate, Outlet)
// USED BY: routes/index.tsx (wraps shop_admin and super_admin routes)
// FLOW: not logged in → /login | wrong role → /unauthorized | ok → render page
EOF

# ── Components: Product ──────────────────────────────────────
cat > src/components/product/ProductCard.tsx << 'EOF'
// WHAT: One product displayed in a card with image, name, price, add-to-cart button
// IMPORTS: hooks/useCart, utils/helpers, framer-motion, @mui/material
// USED BY: components/product/ProductGrid.tsx
// SHOWS: image, name, price, stock status (is_available), Add to Cart button
EOF

cat > src/components/product/ProductGrid.tsx << 'EOF'
// WHAT: Responsive grid of ProductCards
// IMPORTS: ProductCard.tsx, @mui/material (Grid)
// USED BY: pages/shop/ProductsPage.tsx
EOF

cat > src/components/product/ProductForm.tsx << 'EOF'
// WHAT: Add/Edit product form with image upload
// IMPORTS: formik, validations/productValidation, services/categoryService, @mui/material
// USED BY: pages/owner/OwnerProducts.tsx (inside a Modal)
// FIELDS: name, description, price, stock, category_id (dropdown from API), image upload
EOF

# ── Components: Cart ──────────────────────────────────────
cat > src/components/cart/CartDrawer.tsx << 'EOF'
// WHAT: Sliding cart panel from the right showing all cart items + total + checkout button
// IMPORTS: hooks/useCart, CartItem.tsx, utils/helpers, @mui/material, react-router-dom
// USED BY: components/layout/Navbar.tsx (opens when cart icon is clicked)
EOF

cat > src/components/cart/CartItem.tsx << 'EOF'
// WHAT: One row in the cart — image, name, price, quantity input, remove button
// IMPORTS: hooks/useCart, utils/helpers, @mui/material
// USED BY: CartDrawer.tsx, pages/cart/CartPage.tsx
EOF

# ── Components: Order ──────────────────────────────────────
cat > src/components/order/OrderCard.tsx << 'EOF'
// WHAT: Displays one order summary — ID, date, items count, total, status badge
// IMPORTS: utils/helpers, @mui/material, OrderStatus.tsx
// USED BY: pages/owner/OwnerOrders.tsx, pages/customer/CustomerOrdersPage.tsx
EOF

cat > src/components/order/OrderStatus.tsx << 'EOF'
// WHAT: Colored status badge — pending/confirmed/shipped/delivered/cancelled
// IMPORTS: utils/helpers (getStatusColor), @mui/material (Chip)
// USED BY: OrderCard.tsx, pages/owner/OwnerOrders.tsx
// STATUSES: pending (yellow), confirmed (blue), shipped (purple), delivered (green), cancelled (red)
EOF

# ── Components: Category ──────────────────────────────────────
cat > src/components/category/CategoryForm.tsx << 'EOF'
// WHAT: Add/Edit category form (simple — just name field)
// IMPORTS: formik, validations/categoryValidation, @mui/material
// USED BY: pages/owner/OwnerCategories.tsx (inside a Modal)
EOF

# ── Pages ──────────────────────────────────────────────
cat > src/pages/auth/LoginPage.tsx << 'EOF'
// WHAT: Login page with email + password form
// IMPORTS: formik, validations/authValidation, services/authService, hooks/useAuth
// FLOW: submit form → call loginService → save to authStore → redirect by role
//   super_admin → /admin/dashboard
//   shop_admin  → /owner/dashboard
//   customer    → /
EOF

cat > src/pages/auth/RegisterPage.tsx << 'EOF'
// WHAT: Register page for new customer accounts
// IMPORTS: formik, validations/authValidation, services/authService, hooks/useAuth
// FIELDS: full_name, email, phone, password, confirmPassword
// FLOW: submit form → call registerService → save to authStore → redirect to home
EOF

cat > src/pages/shop/HomePage.tsx << 'EOF'
// WHAT: Homepage — shows all active shops so customer picks one
// IMPORTS: services/shopService, components/common/Spinner, framer-motion
// FLOW: load all shops → display shop cards → click → go to /shops/:slug/products
EOF

cat > src/pages/shop/ProductsPage.tsx << 'EOF'
// WHAT: All products of ONE shop with category filter + search + pagination
// IMPORTS: services/productService, services/shopService, services/categoryService
//          store/shopStore, components/product/ProductGrid, components/common/{Spinner, Pagination, SearchBar}
// FLOW: read :slug from URL → load shop → load categories → load products → render grid
EOF

cat > src/pages/shop/ProductDetailPage.tsx << 'EOF'
// WHAT: Full product detail — image gallery, description, price, add to cart
// IMPORTS: services/productService, hooks/useCart, utils/helpers, framer-motion
// FLOW: read :id from URL → load product → display → add to cart
EOF

cat > src/pages/cart/CartPage.tsx << 'EOF'
// WHAT: Full cart page — list all items, update quantities, clear, checkout
// IMPORTS: hooks/useCart, components/cart/CartItem, utils/helpers
EOF

cat > src/pages/checkout/CheckoutPage.tsx << 'EOF'
// WHAT: Order confirmation + delivery address + place order
// IMPORTS: hooks/useCart, services/orderService, validations/orderValidation, formik
// FLOW: show cart summary → enter address → place order → clear cart → success redirect
// ⚠️ Protected route — must be logged in as customer
EOF

cat > src/pages/customer/CustomerOrdersPage.tsx << 'EOF'
// WHAT: Customer views their own order history with status tracking
// IMPORTS: services/orderService, components/order/OrderCard, components/common/{Spinner, Pagination}
// FLOW: load my orders → display list with status badges → click to see details
// ⚠️ Protected route — must be logged in as customer
EOF

cat > src/pages/owner/OwnerDashboard.tsx << 'EOF'
// WHAT: Shop admin home — stats: total orders, pending orders, total revenue
// IMPORTS: hooks/useAuth, services/orderService
// PROTECTED: role = shop_admin only
EOF

cat > src/pages/owner/OwnerProducts.tsx << 'EOF'
// WHAT: Shop admin manages their products — table with add/edit/delete
// IMPORTS: services/productService, components/product/ProductForm, hooks/useAuth
// PROTECTED: role = shop_admin only
EOF

cat > src/pages/owner/OwnerOrders.tsx << 'EOF'
// WHAT: Shop admin views + updates orders for their shop only
// IMPORTS: services/orderService, hooks/useAuth, components/order/OrderCard, OrderStatus
// PROTECTED: role = shop_admin only
// ACTIONS: Update status (pending → confirmed → shipped → delivered / cancelled)
EOF

cat > src/pages/owner/OwnerCategories.tsx << 'EOF'
// WHAT: Shop admin manages product categories — add/edit/delete
// IMPORTS: services/categoryService, components/category/CategoryForm, hooks/useAuth
// PROTECTED: role = shop_admin only
EOF

cat > src/pages/owner/OwnerProfile.tsx << 'EOF'
// WHAT: Shop admin views + edits their shop info (name, description, logo)
// IMPORTS: services/shopService, hooks/useAuth, formik
// PROTECTED: role = shop_admin only
// FIELDS: Shop name, description, logo upload
EOF

cat > src/pages/admin/AdminDashboard.tsx << 'EOF'
// WHAT: Super admin overview of entire platform — total shops, users, orders
// IMPORTS: services/shopService, services/userService
// PROTECTED: role = super_admin only
EOF

cat > src/pages/admin/AdminShops.tsx << 'EOF'
// WHAT: Super admin manages all shops — activate/deactivate, create new shops
// IMPORTS: services/shopService
// PROTECTED: role = super_admin only
EOF

cat > src/pages/admin/AdminUsers.tsx << 'EOF'
// WHAT: Super admin views all users across all shops — search, filter, role change
// IMPORTS: services/userService, components/common/{Pagination, SearchBar}
// PROTECTED: role = super_admin only
EOF

cat > src/pages/error/NotFoundPage.tsx << 'EOF'
// WHAT: 404 page — shown when URL doesn't match any route
// IMPORTS: framer-motion, @mui/material, react-router-dom
EOF

cat > src/pages/error/UnauthorizedPage.tsx << 'EOF'
// WHAT: 403 page — shown when user doesn't have the right role
// IMPORTS: @mui/material, react-router-dom
EOF

ok "Frontend done!"
cd ..


# ============================================================
# BACKEND
# ============================================================
log "Setting up Backend..."

mkdir backend && cd backend

cat > package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":   "nodemon",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
EOF

pnpm add express typescript ts-node dotenv cors helmet morgan \
  jsonwebtoken bcryptjs multer multer-storage-cloudinary cloudinary \
  sequelize pg pg-hstore express-validator express-rate-limit

pnpm add -D @types/node @types/express @types/jsonwebtoken @types/bcryptjs \
  @types/multer @types/cors @types/morgan @types/pg nodemon \
  eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-config-prettier

mkdir -p src/config src/types src/models src/middleware \
  src/validations src/services src/controllers src/routes src/utils

# Config files
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020", "module": "commonjs", "lib": ["ES2020"],
    "outDir": "./dist", "rootDir": "./src", "strict": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "resolveJsonModule": true, "baseUrl": ".", "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > nodemon.json << 'EOF'
{
  "watch": ["src"], "ext": "ts,json",
  "ignore": ["dist", "**/*.test.ts"],
  "exec": "ts-node src/server.ts"
}
EOF

cat > .env.example << 'EOF'
# WHAT: Backend environment variables — copy to .env and fill values
# NEVER push .env to GitHub!

PORT=5000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=duhok_ecommerce
DB_USER=postgres
DB_PASSWORD=your_password

# JWT — make it long and random!
JWT_SECRET=change_this_to_a_very_long_random_secret_string
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
EOF

cat > Procfile << 'EOF'
web: node dist/server.js
EOF

cat > .prettierrc << 'EOF'
{ "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5", "printWidth": 100 }
EOF

# ── Source files ──────────────────────────────────────────────
cat > src/server.ts << 'EOF'
// WHAT: Entry point — connects DB then starts HTTP server
// IMPORTS: app.ts, config/database.ts
// FLOW: connectDB() → app.listen(PORT)
EOF

cat > src/app.ts << 'EOF'
// WHAT: Express app setup — registers all middleware and routes
// IMPORTS: all routes, error.middleware, rateLimiter.middleware
// USED BY: server.ts
// ORDER MATTERS: cors → helmet → rateLimiter → body-parser → routes → error handler (last!)
//
// ROUTE REGISTRATION:
//   /api/auth       → auth.routes.ts
//   /api/shops      → shop.routes.ts
//   /api/products   → product.routes.ts
//   /api/categories → category.routes.ts
//   /api/orders     → order.routes.ts
//   /api/admin      → admin.routes.ts
EOF

cat > src/config/env.ts << 'EOF'
// WHAT: Validates all .env variables at startup — crashes early if anything is missing
// IMPORTS: dotenv
// USED BY: server.ts (imported first before anything else)
EOF

cat > src/config/database.ts << 'EOF'
// WHAT: Sequelize connection to PostgreSQL
// IMPORTS: sequelize, models/index.ts (to register all models)
// USED BY: server.ts (connectDB function called at startup)
EOF

cat > src/config/cloudinary.ts << 'EOF'
// WHAT: Configures Cloudinary SDK for image uploads
// IMPORTS: cloudinary package, config/env.ts
// USED BY: middleware/upload.middleware.ts
EOF

# ── Types ──────────────────────────────────────────────
cat > src/types/index.ts << 'EOF'
// WHAT: Backend TypeScript types shared across controllers, services, middleware
// IMPORTS: Nothing
// CONTAINS: JwtPayload, PaginationOptions, ProductQueryParams, OrderQueryParams
// ROLES: 'super_admin' | 'shop_admin' | 'customer'
EOF

cat > src/types/express.d.ts << 'EOF'
// WHAT: Extends Express Request type so TypeScript knows about req.user and req.shopId
// WHY: Auth middleware adds req.user — without this file TypeScript would give an error
// IMPORTS: Nothing
// USED BY: TypeScript automatically — just having this file is enough
// CONTAINS:
//   declare global {
//     namespace Express {
//       interface Request {
//         user?: { id: number, shop_id: number | null, role: string, email: string }
//         shopId?: number
//       }
//     }
//   }
EOF

# ── Models ──────────────────────────────────────────────
cat > src/models/Shop.ts << 'EOF'
// WHAT: Sequelize model for "shops" table — one row = one shop/tenant
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/shop.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   name         → VARCHAR, shop display name
//   slug         → VARCHAR, UNIQUE, URL-friendly: 'zaytoon-store'
//   description  → TEXT, shop description
//   logo_url     → VARCHAR, Cloudinary image URL
//   is_active    → BOOLEAN, default true (super admin can deactivate)
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
EOF

cat > src/models/User.ts << 'EOF'
// WHAT: Sequelize model for "users" table — ALL users in the system
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/auth.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops (NULL for super_admin, NULL for unattached customers)
//   full_name    → VARCHAR
//   email        → VARCHAR, UNIQUE
//   password     → VARCHAR, BCRYPT HASH — never plain text!
//   phone        → VARCHAR (optional)
//   role         → VARCHAR: 'super_admin' | 'shop_admin' | 'customer'
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
EOF

cat > src/models/Category.ts << 'EOF'
// WHAT: Sequelize model for "categories" table — product categories per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/category.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   name         → VARCHAR
//   created_at   → TIMESTAMP
EOF

cat > src/models/Product.ts << 'EOF'
// WHAT: Sequelize model for "products" table
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   category_id  → INTEGER, FK → categories
//   name         → VARCHAR
//   description  → TEXT
//   price        → DECIMAL(10,2)
//   stock        → INTEGER
//   image_url    → VARCHAR, Cloudinary URL
//   is_available → BOOLEAN, default true
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
EOF

cat > src/models/Order.ts << 'EOF'
// WHAT: Sequelize model for "orders" table
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   user_id      → INTEGER, FK → users
//   total_price  → DECIMAL(10,2)
//   status       → VARCHAR: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
//   address      → TEXT, delivery address
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
// ⚠️ NO items JSONB column — order items are in the order_items table!
EOF

cat > src/models/OrderItem.ts << 'EOF'
// WHAT: Sequelize model for "order_items" table — individual items in each order
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops (for multi-tenancy filtering)
//   order_id     → INTEGER, FK → orders
//   product_id   → INTEGER, FK → products
//   quantity     → INTEGER
//   unit_price   → DECIMAL(10,2), price at time of purchase (snapshot!)
// ⚠️ unit_price is a SNAPSHOT — product.price can change later but this stays fixed
EOF

cat > src/models/index.ts << 'EOF'
// WHAT: Registers ALL model relationships (foreign keys, associations)
// IMPORTS: Shop, User, Category, Product, Order, OrderItem models
// USED BY: config/database.ts (imported once at startup)
// RELATIONS:
//   Shop      hasMany → Users      (shop_id)
//   Shop      hasMany → Categories (shop_id)
//   Shop      hasMany → Products   (shop_id)
//   Shop      hasMany → Orders     (shop_id)
//   Shop      hasMany → OrderItems (shop_id)
//   User      hasMany → Orders     (user_id)
//   Category  hasMany → Products   (category_id)
//   Order     hasMany → OrderItems (order_id)
//   Order     belongsTo → User     (user_id)
//   Order     belongsTo → Shop     (shop_id)
//   OrderItem belongsTo → Order    (order_id)
//   OrderItem belongsTo → Product  (product_id)
//   Product   belongsTo → Category (category_id)
//   Product   belongsTo → Shop     (shop_id)
EOF

# ── Middleware ──────────────────────────────────────────────
cat > src/middleware/auth.middleware.ts << 'EOF'
// WHAT: Verifies JWT token — protects routes from unauthenticated access
// IMPORTS: jsonwebtoken, types/express.d.ts
// USED BY: All protected routes in routes/*.ts
// FLOW: read Authorization header → verify token → attach to req.user → next()
// ERROR: 401 if no token or invalid token
// EXPORTS: authenticate()
EOF

cat > src/middleware/role.middleware.ts << 'EOF'
// WHAT: Checks user role — blocks access if wrong role
// IMPORTS: types/express.d.ts
// USED BY: routes/admin.routes.ts, routes/category.routes.ts, routes/product.routes.ts
// USAGE: authorize('super_admin') or authorize('shop_admin', 'super_admin')
// FLOW: check req.user.role is in allowedRoles → yes → next() | no → 403 Forbidden
// EXPORTS: authorize(...roles: string[])
// ⚠️ Must be placed AFTER auth.middleware (req.user must exist!)
EOF

cat > src/middleware/shop.middleware.ts << 'EOF'
// WHAT: ⚠️ CRITICAL — The heart of multi-tenancy!
// Reads shop_id from JWT token (req.user.shop_id) and attaches to req.shopId
// IMPORTS: types/express.d.ts
// USED BY: product routes, order routes, category routes (any route that is shop-specific)
// ⚠️ SECURITY: NEVER read shop_id from req.body — always from JWT token!
//    A malicious user could send any shop_id in body and access other shops' data!
// EXPORTS: attachShopId()
EOF

cat > src/middleware/upload.middleware.ts << 'EOF'
// WHAT: Handles image file uploads directly to Cloudinary via Multer
// IMPORTS: multer, multer-storage-cloudinary, config/cloudinary.ts
// USED BY: routes/product.routes.ts (create product endpoint), routes/shop.routes.ts (update logo)
// RESULT: After this runs, req.file.path = the Cloudinary image URL — save this to DB!
// LIMITS: 5MB max, jpeg/png/webp only
// EXPORTS: upload
EOF

cat > src/middleware/error.middleware.ts << 'EOF'
// WHAT: Global error handler — catches ALL errors from ALL routes
// IMPORTS: Nothing
// USED BY: app.ts (must be the LAST middleware registered!)
// FLOW: any controller calls next(error) → this runs → sends clean JSON error response
// EXPORTS: errorHandler()
EOF

cat > src/middleware/validate.middleware.ts << 'EOF'
// WHAT: Checks express-validator results — runs AFTER validation rules
// IMPORTS: express-validator (validationResult)
// USED BY: routes/auth.routes.ts, routes/product.routes.ts, routes/order.routes.ts
// FLOW: validation rules run → validate() checks results → error? send 400 : call next()
// EXPORTS: validate()
EOF

cat > src/middleware/rateLimiter.middleware.ts << 'EOF'
// WHAT: Rate limiting — prevents brute force attacks
// IMPORTS: express-rate-limit
// USED BY: app.ts (global limiter), routes/auth.routes.ts (strict login limiter)
// EXPORTS:
//   globalLimiter  → 100 requests per 15 minutes per IP (general)
//   authLimiter    → 10 requests per 15 minutes per IP (login/register only)
EOF

# ── Validations ──────────────────────────────────────────────
cat > src/validations/auth.validation.ts << 'EOF'
// WHAT: express-validator rules for auth endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/auth.routes.ts
// CONTAINS: registerValidation[], loginValidation[]
// FIELDS: full_name, email, phone, password (register) | email, password (login)
EOF

cat > src/validations/product.validation.ts << 'EOF'
// WHAT: express-validator rules for product endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/product.routes.ts
// CONTAINS: createProductValidation[], updateProductValidation[]
// FIELDS: name, description (min 10), price (positive number), stock (≥0), category_id
EOF

cat > src/validations/order.validation.ts << 'EOF'
// WHAT: express-validator rules for order endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/order.routes.ts
// CONTAINS: placeOrderValidation[], updateStatusValidation[]
// FIELDS: items[] (product_id, quantity), address (required)
EOF

cat > src/validations/shop.validation.ts << 'EOF'
// WHAT: express-validator rules for shop endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/admin.routes.ts
// CONTAINS: createShopValidation[], updateShopValidation[]
// FIELDS: name, slug (alphanumeric + hyphens), description
EOF

cat > src/validations/category.validation.ts << 'EOF'
// WHAT: express-validator rules for category endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/category.routes.ts
// CONTAINS: createCategoryValidation[], updateCategoryValidation[]
// FIELDS: name (required, min 2)
EOF

# ── Services ──────────────────────────────────────────────
cat > src/services/auth.service.ts << 'EOF'
// WHAT: Business logic for authentication — register, login, get user
// IMPORTS: models/User.ts, utils/password.ts, utils/jwt.ts
// USED BY: controllers/auth.controller.ts
// LOGIC: check email exists → hash password → create user → generate token
// NOTE: New users register as 'customer' by default. super_admin creates shop_admins.
EOF

cat > src/services/product.service.ts << 'EOF'
// WHAT: Business logic for products — CRUD + image handling
// IMPORTS: models/Product.ts, models/Category.ts, models/Shop.ts
// USED BY: controllers/product.controller.ts
// ⚠️ Always filters by shop_id to prevent cross-shop data access!
// USES: is_available (NOT is_active)
EOF

cat > src/services/order.service.ts << 'EOF'
// WHAT: Business logic for orders — create, list, update status
// IMPORTS: models/Order.ts, models/OrderItem.ts, models/Product.ts
// USED BY: controllers/order.controller.ts
// LOGIC: validate stock → snapshot prices into order_items → create order → reduce stock
// STATUSES: pending → confirmed → shipped → delivered (or cancelled at any point)
EOF

cat > src/services/shop.service.ts << 'EOF'
// WHAT: Business logic for shops — list, create, update, toggle status
// IMPORTS: models/Shop.ts
// USED BY: controllers/shop.controller.ts, controllers/admin.controller.ts
EOF

cat > src/services/category.service.ts << 'EOF'
// WHAT: Business logic for categories — CRUD per shop
// IMPORTS: models/Category.ts
// USED BY: controllers/category.controller.ts
// ⚠️ Always filters by shop_id — shop_admin can only manage their own categories
EOF

# ── Controllers ──────────────────────────────────────────────
cat > src/controllers/auth.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for auth — calls service → sends response
// IMPORTS: services/auth.service.ts, utils/response.ts
// USED BY: routes/auth.routes.ts
// HANDLES: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
EOF

cat > src/controllers/product.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for products
// IMPORTS: services/product.service.ts, utils/response.ts
// USED BY: routes/product.routes.ts
// HANDLES: GET products, GET by id, POST create (with image), PUT update, DELETE
EOF

cat > src/controllers/order.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for orders
// IMPORTS: services/order.service.ts, utils/response.ts
// USED BY: routes/order.routes.ts
// HANDLES: POST place order, GET my orders, GET shop orders, PATCH update status
EOF

cat > src/controllers/shop.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for shop info (public)
// IMPORTS: services/shop.service.ts, utils/response.ts
// USED BY: routes/shop.routes.ts
// HANDLES: GET all shops, GET shop by slug
EOF

cat > src/controllers/admin.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for super admin actions
// IMPORTS: services/shop.service.ts, models/User.ts, utils/response.ts
// USED BY: routes/admin.routes.ts
// HANDLES: Create shop + assign shop_admin, activate/deactivate shop, list/manage all users
// PROTECTED: super_admin role only
EOF

cat > src/controllers/category.controller.ts << 'EOF'
// WHAT: Handles HTTP requests for categories (per shop)
// IMPORTS: services/category.service.ts, utils/response.ts
// USED BY: routes/category.routes.ts
// HANDLES: GET shop categories (public), POST create, PUT update, DELETE (shop_admin)
EOF

# ── Routes ──────────────────────────────────────────────
cat > src/routes/auth.routes.ts << 'EOF'
// WHAT: Maps auth URLs to middleware + controller
// IMPORTS: auth.controller, auth.validation, validate.middleware, rateLimiter.middleware
// REGISTERED IN: app.ts as /api/auth
// ROUTES:
//   POST /api/auth/register → [authLimiter, registerValidation, validate] → register()
//   POST /api/auth/login    → [authLimiter, loginValidation, validate]    → login()
//   GET  /api/auth/me       → [authenticate]                              → getMe()
EOF

cat > src/routes/product.routes.ts << 'EOF'
// WHAT: Maps product URLs to middleware + controller
// IMPORTS: product.controller, auth.middleware, role.middleware, shop.middleware, upload.middleware
// REGISTERED IN: app.ts as /api/products
// ROUTES:
//   GET    /api/products                → getProducts()   (public, filtered by shop_id query)
//   GET    /api/products/:id            → getProductById() (public)
//   POST   /api/products                → [auth, authorize('shop_admin'), attachShopId, upload] → createProduct()
//   PUT    /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → updateProduct()
//   DELETE /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → deleteProduct()
EOF

cat > src/routes/order.routes.ts << 'EOF'
// WHAT: Maps order URLs to middleware + controller
// IMPORTS: order.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/orders
// ROUTES:
//   POST  /api/orders              → [auth]                                    → placeOrder()
//   GET   /api/orders/my-orders    → [auth]                                    → getMyOrders()
//   GET   /api/orders/shop         → [auth, authorize('shop_admin'), attachShopId] → getShopOrders()
//   PATCH /api/orders/:id/status   → [auth, authorize('shop_admin'), attachShopId] → updateStatus()
EOF

cat > src/routes/shop.routes.ts << 'EOF'
// WHAT: Maps shop URLs to controller (public routes, no auth needed)
// IMPORTS: shop.controller
// REGISTERED IN: app.ts as /api/shops
// ROUTES:
//   GET /api/shops                  → getAllShops()
//   GET /api/shops/slug/:slug       → getShopBySlug()
//   GET /api/shops/:id/products     → getShopProducts()
//   GET /api/shops/:id/categories   → getShopCategories()
EOF

cat > src/routes/category.routes.ts << 'EOF'
// WHAT: Maps category URLs to middleware + controller
// IMPORTS: category.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/categories
// ROUTES:
//   GET    /api/categories?shop_id=1   → getCategories()   (public)
//   POST   /api/categories             → [auth, authorize('shop_admin'), attachShopId] → createCategory()
//   PUT    /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → updateCategory()
//   DELETE /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → deleteCategory()
EOF

cat > src/routes/admin.routes.ts << 'EOF'
// WHAT: Maps super admin URLs — ALL require super_admin role
// IMPORTS: admin.controller, auth.middleware, role.middleware
// REGISTERED IN: app.ts as /api/admin
// ROUTES:
//   GET   /api/admin/shops             → getAllShops()
//   POST  /api/admin/shops             → createShop()
//   PATCH /api/admin/shops/:id         → toggleShopStatus()
//   GET   /api/admin/users             → getAllUsers()
//   PATCH /api/admin/users/:id/role    → changeUserRole()
//   DELETE /api/admin/users/:id        → deleteUser()
EOF

# ── Utils ──────────────────────────────────────────────
cat > src/utils/jwt.ts << 'EOF'
// WHAT: Generate and verify JWT tokens
// IMPORTS: jsonwebtoken, config/env.ts
// USED BY: services/auth.service.ts (generate), middleware/auth.middleware.ts (verify)
// CONTAINS: generateToken(payload), verifyToken(token)
EOF

cat > src/utils/password.ts << 'EOF'
// WHAT: Hash passwords with bcrypt + compare on login
// IMPORTS: bcryptjs
// USED BY: services/auth.service.ts
// CONTAINS: hashPassword(plain), comparePassword(plain, hash)
// ⚠️ NEVER store plain text passwords!
EOF

cat > src/utils/response.ts << 'EOF'
// WHAT: Standard helpers for consistent API responses
// IMPORTS: express (Response type)
// USED BY: All controllers
// CONTAINS: sendSuccess(res, data, message), sendError(res, message, status), sendPaginated(res, data, total, page, limit)
EOF

ok "Backend done!"
cd ..


# ============================================================
# DATABASE (Sequelize CLI)
# ============================================================
log "Setting up Database..."

mkdir database && cd database

cat > package.json << 'EOF'
{
  "name": "database",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo:all",
    "seed": "sequelize-cli db:seed:all",
    "seed:undo": "sequelize-cli db:seed:undo:all"
  },
  "dependencies": { "sequelize": "^6.35.0", "pg": "^8.11.0", "pg-hstore": "^2.3.4" },
  "devDependencies": { "sequelize-cli": "^6.6.2", "dotenv": "^16.0.0", "bcryptjs": "^2.4.3" }
}
EOF

pnpm install

cat > .sequelizerc << 'EOF'
// WHAT: Tells Sequelize CLI where to find config, migrations, seeders
// USED BY: sequelize-cli automatically reads this file
// NOTE: No models folder here — models live in backend/src/models/ only!
const path = require('path')
module.exports = {
  'config':          path.resolve('config', 'database.js'),
  'seeders-path':    path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
}
EOF

cat > .env.example << 'EOF'
# WHAT: Database CLI connection variables — copy to .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=duhok_ecommerce
DB_USER=postgres
DB_PASSWORD=your_password
EOF

mkdir -p config migrations seeders

cat > config/database.js << 'EOF'
// WHAT: Sequelize CLI connection config — reads from .env
// USED BY: Sequelize CLI when running db:migrate and db:seed
// HOW: copy .env.example → .env → fill your PostgreSQL values
require('dotenv').config()
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST || '127.0.0.1',
    port:     process.env.DB_PORT || 5432,
    dialect:  'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  }
}
EOF

# ── Migrations (6 tables — matches project-context.md) ──────────
cat > migrations/01-create-shops.js << 'EOF'
// WHAT: Creates the "shops" table — run FIRST (no dependencies)
// HOW TO RUN: pnpm migrate (from database/ folder)
// ⚠️ Must run before all other migrations!
// COLUMNS: id, name, slug (unique), description, logo_url, is_active, created_at, updated_at
EOF

cat > migrations/02-create-users.js << 'EOF'
// WHAT: Creates the "users" table — references shops (run after 01)
// COLUMNS: id, shop_id (FK→shops, nullable), full_name, email (unique), password, phone, role, created_at, updated_at
// ROLES: 'super_admin' | 'shop_admin' | 'customer'
// NOTE: shop_id is NULL for super_admin users (they manage all shops)
EOF

cat > migrations/03-create-categories.js << 'EOF'
// WHAT: Creates "categories" table — references shops (run after 01)
// COLUMNS: id, shop_id (FK→shops), name, created_at
EOF

cat > migrations/04-create-products.js << 'EOF'
// WHAT: Creates "products" table — references shops + categories (run after 01, 03)
// COLUMNS: id, shop_id (FK), category_id (FK), name, description, price, stock, image_url, is_available, created_at, updated_at
// NOTE: is_available (NOT is_active!) — matches team agreement
EOF

cat > migrations/05-create-orders.js << 'EOF'
// WHAT: Creates "orders" table — references users + shops (run after 01, 02)
// COLUMNS: id, shop_id (FK), user_id (FK), total_price, status, address, created_at, updated_at
// STATUS VALUES: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
// ⚠️ NO items JSONB column — order items are stored in the order_items table!
EOF

cat > migrations/06-create-order-items.js << 'EOF'
// WHAT: Creates "order_items" table — references orders + products + shops (run LAST)
// COLUMNS: id, shop_id (FK), order_id (FK), product_id (FK), quantity, unit_price
// ⚠️ unit_price is a SNAPSHOT of the price at the time of purchase
//    This is critical: product.price can change later but order_item.unit_price stays the same!
EOF

# ── Seeders (ALL tables — for development testing) ──────────
cat > seeders/01-seed-shops.js << 'EOF'
// WHAT: Inserts sample shops for development testing
// HOW TO RUN: pnpm seed (from database/ folder)
// DATA:
//   { name: 'Zaytoon Store', slug: 'zaytoon-store', description: 'Fresh groceries...', is_active: true }
//   { name: 'Duhok Electronics', slug: 'duhok-electronics', description: 'Gadgets...', is_active: true }
//   { name: 'Kurdish Fashion', slug: 'kurdish-fashion', description: 'Clothing...', is_active: true }
// ⚠️ Only for development — never seed production with fake data!
EOF

cat > seeders/02-seed-users.js << 'EOF'
// WHAT: Inserts test users for all roles
// DATA:
//   { full_name: 'Super Admin', email: 'admin@duhok.com', role: 'super_admin', shop_id: null }
//   { full_name: 'Zaytoon Owner', email: 'owner@zaytoon.com', role: 'shop_admin', shop_id: 1 }
//   { full_name: 'Electronics Owner', email: 'owner@electronics.com', role: 'shop_admin', shop_id: 2 }
//   { full_name: 'Test Customer', email: 'customer@test.com', role: 'customer', shop_id: null }
// ⚠️ Always bcrypt hash passwords in seeders — never plain text!
//    Use: const bcrypt = require('bcryptjs'); bcrypt.hashSync('password123', 10)
EOF

cat > seeders/03-seed-categories.js << 'EOF'
// WHAT: Inserts sample categories for test shops
// DATA:
//   Shop 1 (Zaytoon): Fruits, Vegetables, Dairy, Beverages
//   Shop 2 (Electronics): Phones, Laptops, Accessories, Audio
//   Shop 3 (Fashion): Men, Women, Kids, Shoes
EOF

cat > seeders/04-seed-products.js << 'EOF'
// WHAT: Inserts sample products for test shops
// DATA: 3-5 products per category per shop
// FIELDS: shop_id, category_id, name, description, price, stock, image_url, is_available
// ⚠️ Use realistic prices and descriptions for testing
EOF

cat > seeders/05-seed-orders.js << 'EOF'
// WHAT: Inserts sample orders + order_items for testing
// DATA:
//   2-3 orders per shop with various statuses
//   Each order has 1-3 order_items
// FIELDS (orders): shop_id, user_id, total_price, status, address
// FIELDS (order_items): shop_id, order_id, product_id, quantity, unit_price
// ⚠️ total_price must equal SUM(quantity * unit_price) for the order's items!
EOF

ok "Database done!"
cd ..


# ============================================================
# DOCS
# ============================================================
log "Setting up Docs..."

mkdir -p docs

cat > docs/api.md << 'EOF'
# 📝 API Documentation
**Written by:** Jiwar + Alan team
**Update this file** every time you add or change an endpoint.

## Auth
- POST /api/auth/register  → { full_name, email, phone, password }
- POST /api/auth/login     → { email, password }
- GET  /api/auth/me        → (token required)

## Shops (Public)
- GET /api/shops
- GET /api/shops/slug/:slug
- GET /api/shops/:id/products
- GET /api/shops/:id/categories

## Products
- GET    /api/products?shop_id=1         (public)
- GET    /api/products/:id               (public)
- POST   /api/products                   (shop_admin, FormData with image)
- PUT    /api/products/:id               (shop_admin)
- DELETE /api/products/:id               (shop_admin)

## Categories
- GET    /api/categories?shop_id=1       (public)
- POST   /api/categories                 (shop_admin)
- PUT    /api/categories/:id             (shop_admin)
- DELETE /api/categories/:id             (shop_admin)

## Orders
- POST  /api/orders                      (customer, { items: [{product_id, quantity}], address })
- GET   /api/orders/my-orders            (customer)
- GET   /api/orders/shop                 (shop_admin)
- PATCH /api/orders/:id/status           (shop_admin, { status })

## Admin (super_admin only)
- GET    /api/admin/shops
- POST   /api/admin/shops                → { name, slug, description }
- PATCH  /api/admin/shops/:id            → { is_active }
- GET    /api/admin/users
- PATCH  /api/admin/users/:id/role       → { role }
- DELETE /api/admin/users/:id
EOF

cat > docs/database.md << 'EOF'
# 🗄️ Database Documentation
**Written by:** Dlawar + Obaida + Khalil team

## How to Run
```bash
cd database
cp .env.example .env    # fill your PostgreSQL values
pnpm migrate            # create 6 tables
pnpm seed               # insert test data
```

## Tables (6 total)
| Table       | Description | Key Columns |
|-------------|-------------|-------------|
| shops       | One row per shop (tenant) | name, slug, logo_url, is_active |
| users       | All platform users | full_name, email, phone, role, shop_id |
| categories  | Product categories per shop | name, shop_id |
| products    | Products linked to shop + category | price, stock, is_available |
| orders      | Customer orders with delivery address | status, address, total_price |
| order_items | Individual items in each order | quantity, unit_price (snapshot) |

## Roles
| Role | shop_id | Access |
|------|---------|--------|
| super_admin | NULL | Manages all shops + users |
| shop_admin | Set to their shop | Manages their shop only |
| customer | NULL | Browses and buys from any shop |

## ER Diagram
<!-- Draw on dbdiagram.io and paste the link here -->

## Migration Order
```
01-create-shops       ← first (no dependencies)
02-create-users       ← after shops (FK: shop_id)
03-create-categories  ← after shops (FK: shop_id)
04-create-products    ← after shops + categories (FK: shop_id, category_id)
05-create-orders      ← after shops + users (FK: shop_id, user_id)
06-create-order-items ← LAST (FK: shop_id, order_id, product_id)
```
EOF

cat > docs/frontend.md << 'EOF'
# ⚛️ Frontend Documentation
**Written by:** Zhegr + Rasheed + Ahmed team

## Setup
```bash
cd frontend && pnpm install
cp .env.example .env   # fill values
pnpm dev               # http://localhost:3000
```

## Pages & Routes
| URL | Page | Access |
|-----|------|--------|
| / | HomePage | Public |
| /login | LoginPage | Public |
| /register | RegisterPage | Public |
| /shops/:slug/products | ProductsPage | Public |
| /shops/:slug/products/:id | ProductDetailPage | Public |
| /cart | CartPage | Public |
| /checkout | CheckoutPage | customer |
| /my-orders | CustomerOrdersPage | customer |
| /owner/dashboard | OwnerDashboard | shop_admin |
| /owner/products | OwnerProducts | shop_admin |
| /owner/orders | OwnerOrders | shop_admin |
| /owner/categories | OwnerCategories | shop_admin |
| /owner/profile | OwnerProfile | shop_admin |
| /admin/dashboard | AdminDashboard | super_admin |
| /admin/shops | AdminShops | super_admin |
| /admin/users | AdminUsers | super_admin |

## State (Zustand)
- authStore → user + token
- cartStore → cart items (tied to ONE shop)
- shopStore → current shop being viewed
EOF

cat > docs/testing.md << 'EOF'
# 🧪 Testing Documentation
**Written by:** All teams

## Test Scenarios to Cover
### Auth
- [ ] Register with valid data → get token
- [ ] Register with existing email → 400 error
- [ ] Login wrong password → 401
- [ ] No token on protected route → 401
- [ ] Wrong role on admin route → 403

### Multi-tenancy (most important!)
- [ ] shop_admin CANNOT see other shop's products
- [ ] shop_admin CANNOT update other shop's orders
- [ ] shop_id from body is ignored (read from JWT only)
- [ ] Customer can browse any shop

### Products
- [ ] Create product → image uploaded to Cloudinary
- [ ] Product shows is_available correctly

### Orders
- [ ] Place order → stock decreases for each order_item
- [ ] Place order → unit_price is snapshot of current price
- [ ] Order items stored in order_items table (NOT JSONB)
- [ ] Status flow: pending → confirmed → shipped → delivered
- [ ] Cancel order at any stage

### Categories
- [ ] shop_admin can create categories for their shop
- [ ] shop_admin CANNOT see other shop's categories
- [ ] Products filter by category works
EOF

ok "Docs done!"


# ============================================================
# TESTS
# ============================================================
log "Setting up Tests..."

mkdir -p tests/unit/backend tests/unit/frontend tests/integration tests/e2e

cat > tests/unit/backend/auth.test.ts << 'EOF'
// WHAT: Tests auth utility functions in isolation
// TESTS: hashPassword, comparePassword, generateToken, verifyToken
// RUN: pnpm test (after configuring Jest)
EOF

cat > tests/unit/backend/product.test.ts << 'EOF'
// WHAT: Tests product service logic
// TESTS: price calculation, stock validation, shop_id isolation, is_available filter
EOF

cat > tests/unit/backend/order.test.ts << 'EOF'
// WHAT: Tests order service logic
// TESTS: order_items creation, unit_price snapshot, stock reduction, total_price calculation
EOF

cat > tests/unit/backend/role.test.ts << 'EOF'
// WHAT: Tests role authorization middleware
// TESTS: super_admin access, shop_admin restricted to own shop, customer denied admin routes
EOF

cat > tests/unit/frontend/authStore.test.ts << 'EOF'
// WHAT: Tests Zustand auth store
// TESTS: setAuth(), logout(), isAuthenticated flag, role checks
EOF

cat > tests/unit/frontend/cartStore.test.ts << 'EOF'
// WHAT: Tests Zustand cart store
// TESTS: addItem(), removeItem(), quantity update, total calculation, shop switch clears cart
EOF

cat > tests/integration/api.test.ts << 'EOF'
// WHAT: Tests full HTTP request → controller → service → DB flow
// TESTS: register, login, get products, place order, create category
// USES: supertest + test database
EOF

cat > tests/e2e/shopping.test.ts << 'EOF'
// WHAT: Simulates a real user going through the full app in a browser
// FLOW: visit homepage → pick shop → filter by category → add to cart → login → enter address → checkout
// USES: Playwright (install separately: pnpm add -D playwright)
EOF

ok "Tests done!"


# ============================================================
# GIT SETUP + PUSH
# ============================================================
log "Setting up Git..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# Install root dependencies
pnpm install

# First commit on main
git add .
git commit -m "🏗️ feat: complete project structure (fixed version — 6 tables, hybrid roles)"

# Create dev branch (team works here!)
git checkout -b dev

echo ""
echo "✅ =============================================="
echo "   DONE! Fixed project structure created! 🎉"
echo "============================================== ✅"
echo ""
echo "📌 NEXT STEPS:"
echo ""
echo "   1. Push to GitHub:"
echo "      git remote add origin https://github.com/SE-Ecco/Ecommerce-Project.git"
echo "      git push -u origin main"
echo "      git push -u origin dev"
echo ""
echo "   2. Each person copies .env.example → .env in their folder"
echo ""
echo "   3. Start Phase 1: DB team draws ER diagram on dbdiagram.io"
echo ""
echo "📁 What was created:"
echo "   frontend/   ⚛️  React + TS (Zhegr + Rasheed + Ahmed)"
echo "   backend/    🖥️  Node + Express + TS (Jiwar + Alan)"
echo "   database/   🗄️  Sequelize CLI — 6 migrations + 5 seeders (Dlawar + Obaida + Khalil)"
echo "   docs/       📝  Documentation (everyone)"
echo "   tests/      🧪  Tests (everyone)"
echo ""
echo "🔧 FIXES IN THIS VERSION:"
echo "   ✅ 6 tables (added order_items)"
echo "   ✅ Hybrid roles: super_admin / shop_admin / customer"
echo "   ✅ Column names match team agreement"
echo "   ✅ Category API (CRUD)"
echo "   ✅ Role authorization middleware"
echo "   ✅ Rate limiter for security"
echo "   ✅ All seeders for all tables"
echo "   ✅ dev branch created"
echo "   ✅ Customer orders page"
echo "   ✅ MUI theme file"
echo "   ✅ Pagination + SearchBar components"
echo ""
echo "🚀 pnpm dev → start building!"
