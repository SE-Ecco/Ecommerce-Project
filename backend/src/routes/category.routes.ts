// WHAT: Maps category URLs to middleware + controller
// IMPORTS: category.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/categories
// ROUTES:
//   GET    /api/categories?shop_id=1   → getCategories()   (public)
//   POST   /api/categories             → [auth, authorize('shop_admin'), attachShopId] → createCategory()
//   PUT    /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → updateCategory()
//   DELETE /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → deleteCategory()
