// WHAT: Maps product URLs to middleware + controller
// IMPORTS: product.controller, auth.middleware, role.middleware, shop.middleware, upload.middleware
// REGISTERED IN: app.ts as /api/products
// ROUTES:
//   GET    /api/products                → getProducts()   (public, filtered by shop_id query)
//   GET    /api/products/:id            → getProductById() (public)
//   POST   /api/products                → [auth, authorize('shop_admin'), attachShopId, upload] → createProduct()
//   PUT    /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → updateProduct()
//   DELETE /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → deleteProduct()
