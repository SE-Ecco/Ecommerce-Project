// WHAT: Maps shop URLs to controller (public routes, no auth needed)
// IMPORTS: shop.controller
// REGISTERED IN: app.ts as /api/shops
// ROUTES:
//   GET /api/shops                  → getAllShops()
//   GET /api/shops/slug/:slug       → getShopBySlug()
//   GET /api/shops/:id/products     → getShopProducts()
//   GET /api/shops/:id/categories   → getShopCategories()
