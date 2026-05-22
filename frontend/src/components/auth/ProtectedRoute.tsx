// WHAT: Guards routes — redirects if not logged in or wrong role
// IMPORTS: hooks/useAuth, react-router-dom (Navigate, Outlet)
// USED BY: routes/index.tsx (wraps shop_admin and super_admin routes)
// FLOW: not logged in → /login | wrong role → /unauthorized | ok → render page
