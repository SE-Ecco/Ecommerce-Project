// WHAT: Maps auth URLs to middleware + controller
// IMPORTS: auth.controller, auth.validation, validate.middleware, rateLimiter.middleware
// REGISTERED IN: app.ts as /api/auth
// ROUTES:
//   POST /api/auth/register → [authLimiter, registerValidation, validate] → register()
//   POST /api/auth/login    → [authLimiter, loginValidation, validate]    → login()
//   GET  /api/auth/me       → [authenticate]                              → getMe()
