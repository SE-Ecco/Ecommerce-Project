// WHAT: Verifies JWT token — protects routes from unauthenticated access
// IMPORTS: jsonwebtoken, types/express.d.ts
// USED BY: All protected routes in routes/*.ts
// FLOW: read Authorization header → verify token → attach to req.user → next()
// ERROR: 401 if no token or invalid token
// EXPORTS: authenticate()
