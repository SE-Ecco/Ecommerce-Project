// WHAT: Checks user role — blocks access if wrong role
// IMPORTS: types/express.d.ts
// USED BY: routes/admin.routes.ts, routes/category.routes.ts, routes/product.routes.ts
// USAGE: authorize('super_admin') or authorize('shop_admin', 'super_admin')
// FLOW: check req.user.role is in allowedRoles → yes → next() | no → 403 Forbidden
// EXPORTS: authorize(...roles: string[])
// ⚠️ Must be placed AFTER auth.middleware (req.user must exist!)
