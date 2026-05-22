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
