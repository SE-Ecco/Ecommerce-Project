// WHAT: Maps super admin URLs — ALL require super_admin role
// IMPORTS: admin.controller, auth.middleware, role.middleware
// REGISTERED IN: app.ts as /api/admin
// ROUTES:
//   GET   /api/admin/shops             → getAllShops()
//   POST  /api/admin/shops             → createShop()
//   PATCH /api/admin/shops/:id         → toggleShopStatus()
//   GET   /api/admin/users             → getAllUsers()
//   PATCH /api/admin/users/:id/role    → changeUserRole()
//   DELETE /api/admin/users/:id        → deleteUser()
