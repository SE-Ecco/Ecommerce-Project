// WHAT: Global auth state — logged in user + token, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts, config/constants.ts
// USED BY: hooks/useAuth.ts (which is used by every component that needs user info)
// CONTAINS: user, token, isAuthenticated, setAuth(), logout()
