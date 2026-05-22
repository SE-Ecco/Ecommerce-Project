# 📝 API Documentation
**Written by:** Jiwar + Alan team
**Update this file** every time you add or change an endpoint.

## Auth
- POST /api/auth/register  → { full_name, email, phone, password }
- POST /api/auth/login     → { email, password }
- GET  /api/auth/me        → (token required)

## Shops (Public)
- GET /api/shops
- GET /api/shops/slug/:slug
- GET /api/shops/:id/products
- GET /api/shops/:id/categories

## Products
- GET    /api/products?shop_id=1         (public)
- GET    /api/products/:id               (public)
- POST   /api/products                   (shop_admin, FormData with image)
- PUT    /api/products/:id               (shop_admin)
- DELETE /api/products/:id               (shop_admin)

## Categories
- GET    /api/categories?shop_id=1       (public)
- POST   /api/categories                 (shop_admin)
- PUT    /api/categories/:id             (shop_admin)
- DELETE /api/categories/:id             (shop_admin)

## Orders
- POST  /api/orders                      (customer, { items: [{product_id, quantity}], address })
- GET   /api/orders/my-orders            (customer)
- GET   /api/orders/shop                 (shop_admin)
- PATCH /api/orders/:id/status           (shop_admin, { status })

## Admin (super_admin only)
- GET    /api/admin/shops
- POST   /api/admin/shops                → { name, slug, description }
- PATCH  /api/admin/shops/:id            → { is_active }
- GET    /api/admin/users
- PATCH  /api/admin/users/:id/role       → { role }
- DELETE /api/admin/users/:id
