🗺️ Frontend Files — How They Connect

main.tsx — Power Switch 🔌

The very first file that runs.
It mounts React into the HTML page.
index.html has <div id="root"> → main.tsx fills it with App.
Without this → blank page forever.

App.tsx — Building Blueprint 🏗️

Wraps EVERYTHING with providers:
  BrowserRouter → enables URL routing
  ThemeProvider → applies MUI colors/fonts
  CssBaseline  → resets browser default styles
  AppRoutes    → renders the correct page per URL

routes/index.tsx — Map of Pages 🗺️

Defines which URL → which page:
  /login     → LoginPage
  /products  → ProductsPage
  /owner/*   → owner dashboard pages
All wrapped with layouts and ProtectedRoute guards.

config/constants.ts — Config Box ⚙️

One place for values used everywhere:
  API_BASE_URL → backend URL
  ROLES        → 'customer', 'shop_admin', 'super_admin'
  AUTH_TOKEN_KEY → localStorage key name
Change once here → updates everywhere ✅

types/index.ts — Shape Dictionary 📖

TypeScript interfaces — defines shape of data:
  User    → { id, name, email, role, shop_id... }
  Product → { id, name, price, stock... }
  Order   → { id, status, total_price... }
If backend returns different fields → update here.

services/api.ts — Phone Line 📞

Configured Axios instance:
  baseURL → http://localhost:5000/api (from constants)
  interceptor → auto-attaches Bearer token to EVERY request
All other services use THIS, never raw axios.

store/authStore.ts — Memory Box 🧠

Zustand store — global state for auth:
  user        → logged in user object
  token       → JWT string
  isAuthenticated → true/false
  setAuth()   → called after login/register
  logout()    → clears everything
persist middleware → survives page refresh (localStorage)

hooks/useAuth.ts — Remote Control 🎮

Bridge between UI and authStore + authService:
  login()    → calls authService.login() → saves to store
  register() → calls authService.register() → saves to store
  logout()   → clears store
  isCustomer / isShopAdmin / isSuperAdmin → role helpers
Pages use this hook — never touch store or service directly!

services/authService.ts — Postman Worker 📬

Makes HTTP requests to backend auth endpoints:
  register() → POST /auth/register
  login()    → POST /auth/login
  getMe()    → GET  /auth/me
Returns data → hook saves it to store.

validations/authValidation.ts — Form Bouncer 🚪

Yup schemas — validates form data BEFORE sending to backend:
  loginSchema    → email format, password not empty
  registerSchema → full_name required, password min 8 chars
Used by Formik in LoginPage + RegisterPage.

components/auth/ProtectedRoute.tsx — Security Guard 💂

Wraps private routes:
  Not logged in → redirect to /login
  Wrong role → redirect to /unauthorized
  All good → show the page
Used in routes/index.tsx to protect owner/admin pages.
🔗 How They All Connect
User opens browser → http://localhost:3000
    ↓
main.tsx → mounts App.tsx
    ↓
App.tsx → BrowserRouter + ThemeProvider + AppRoutes
    ↓
routes/index.tsx → matches URL → renders page
    ↓
Page uses useAuth() hook
    ↓
useAuth reads authStore (is user logged in?)
    ↓
If not logged in → ProtectedRoute redirects to /login
    ↓
LoginPage → Formik form + authValidation schema
    ↓
User submits → useAuth.login() called
    ↓
authService.login() → api.ts → POST /auth/login → backend
    ↓
Backend returns { user, token }
    ↓
authStore.setAuth(user, token) → saved to memory + localStorage
    ↓
User is now authenticated ✅ → redirected to homepage