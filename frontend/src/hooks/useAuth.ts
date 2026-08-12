// WHAT: Simplifies reading auth state + role checks
// IMPORTS: store/authStore.ts
// USED BY: components/auth/ProtectedRoute, pages/*, components/layout/Navbar, Sidebar
// RETURNS: user, isAuthenticated, isCustomer, isShopAdmin, isSuperAdmin, setAuth, logout
// WHAT: Simplifies reading auth state + role checks
// IMPORTS: store/authStore.ts
// USED BY: components/auth/ProtectedRoute, pages/*, components/layout/Navbar, Sidebar
// RETURNS: user, isAuthenticated, isCustomer, isShopAdmin, isSuperAdmin, setAuth, logout
// WHAT: Hook for auth state — reads authStore, exposes helpers
// IMPORTS: authStore, authService
// USED BY: LoginPage, RegisterPage, ProtectedRoute, Navbar

import { useAuthStore } from '../store/authStore'
import * as authService from '../services/authService'

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore()

  // role helpers — avoids repeating user?.role === '...' everywhere
  const isCustomer = user?.role === 'customer'
  const isShopAdmin = user?.role === 'shop_admin'
  const isSuperAdmin = user?.role === 'super_admin'

  // login → calls service → saves to store
  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password)
    setAuth(data.user, data.token)
    return data
  }

  // register → calls service → saves to store
  const register = async (
    full_name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    const data = await authService.register(full_name, email, password, phone)
    setAuth(data.user, data.token)
    return data
  }

  return {
    user,
    token,
    isAuthenticated,
    isCustomer,
    isShopAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
  }
}
// NOTES:
// → useAuthStore: the only import this hook needs — all raw auth state (user, token,
//   isAuthenticated) plus the actions (setAuth, logout) already live inside the
//   Zustand store built in Phase P, so this hook doesn't create any new state itself,
//   it just reaches into the existing box and repackages what's there
// → const { user, token, isAuthenticated, setAuth, logout } = useAuthStore():
//   calling the store hook with no selector returns the whole store object, then
//   destructuring immediately pulls out exactly the 5 fields this hook cares about —
//   nothing extra gets carried around
// → user?.role === 'customer' (and the shop_admin / super_admin lines): the backend
//   sends ONE role string inside the user object at login (e.g. "shop_admin") —
//   authStore just stores that object as-is, it does NOT store 3 separate booleans.
//   useAuth is the one place that translates that single role string into 3 clean
//   yes/no flags, calculated fresh on every render
// → the `?.` optional chaining matters here: before login, user is null, so
//   user?.role safely returns undefined instead of throwing a crash — all 3 checks
//   then correctly evaluate to false
// → the returned object merges the raw store values with the 3 calculated role
//   flags into a single bundle — this exact shape matches the blueprint's
//   RETURNS: line, so every consumer (Navbar, Sidebar, ProtectedRoute, pages/*)
//   gets one consistent API instead of reaching into the store directly

/** STORY
 * authStore.ts is the back-office safe 🔒 — it holds the raw employee ID badge
 * (the user object, including its single role field) exactly as the backend
 * sent it at login. The safe doesn't interpret anything, it just stores it.
 *
 * useAuth.ts is the front desk clerk 🧑‍💼. No component ever walks into the
 * back office and digs through the safe itself — instead, every component
 * (Navbar, Sidebar, ProtectedRoute, any page) walks up to the same clerk and
 * asks "who's logged in, and what are they allowed to do?"
 *
 * The clerk reads the raw badge fresh every single time and translates it:
 * "role says shop_admin, so isShopAdmin is true, the other two are false."
 * That translation never gets written back into the safe — it's recalculated
 * on the spot every time someone asks, which keeps the safe (authStore) simple
 * and dumb, and keeps all the "smart" logic in one single place (useAuth) instead
 * of copy-pasted across every component that needs a role check.
 */