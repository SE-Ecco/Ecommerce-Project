// WHAT: Business logic for products — CRUD + image handling
// IMPORTS: models/Product.ts, models/Category.ts, models/Shop.ts
// USED BY: controllers/product.controller.ts
// ⚠️ Always filters by shop_id to prevent cross-shop data access!
// USES: is_available (NOT is_active)
