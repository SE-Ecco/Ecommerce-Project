// WHAT: API calls for categories (per shop)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/owner/OwnerCategories, components/product/ProductForm (category dropdown)
// ENDPOINTS:
//   GET    /api/shops/:shopId/categories      → list categories for a shop
//   POST   /api/categories                    → create category (shop_admin)
//   PUT    /api/categories/:id                → update category (shop_admin)
//   DELETE /api/categories/:id                → delete category (shop_admin)
