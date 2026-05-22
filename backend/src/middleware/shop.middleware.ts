// WHAT: ⚠️ CRITICAL — The heart of multi-tenancy!
// Reads shop_id from JWT token (req.user.shop_id) and attaches to req.shopId
// IMPORTS: types/express.d.ts
// USED BY: product routes, order routes, category routes (any route that is shop-specific)
// ⚠️ SECURITY: NEVER read shop_id from req.body — always from JWT token!
//    A malicious user could send any shop_id in body and access other shops' data!
// EXPORTS: attachShopId()
