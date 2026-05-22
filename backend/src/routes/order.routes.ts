// WHAT: Maps order URLs to middleware + controller
// IMPORTS: order.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/orders
// ROUTES:
//   POST  /api/orders              → [auth]                                    → placeOrder()
//   GET   /api/orders/my-orders    → [auth]                                    → getMyOrders()
//   GET   /api/orders/shop         → [auth, authorize('shop_admin'), attachShopId] → getShopOrders()
//   PATCH /api/orders/:id/status   → [auth, authorize('shop_admin'), attachShopId] → updateStatus()
