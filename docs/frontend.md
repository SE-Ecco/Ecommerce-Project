# ⚛️ Frontend Documentation
**Written by:** Zhegr + Rasheed + Ahmed team

## Setup
```bash
cd frontend && pnpm install
cp .env.example .env   # fill values
pnpm dev               # http://localhost:3000
```

## Pages & Routes
| URL | Page | Access |
|-----|------|--------|
| / | HomePage | Public |
| /login | LoginPage | Public |
| /register | RegisterPage | Public |
| /shops/:slug/products | ProductsPage | Public |
| /shops/:slug/products/:id | ProductDetailPage | Public |
| /cart | CartPage | Public |
| /checkout | CheckoutPage | customer |
| /my-orders | CustomerOrdersPage | customer |
| /owner/dashboard | OwnerDashboard | shop_admin |
| /owner/products | OwnerProducts | shop_admin |
| /owner/orders | OwnerOrders | shop_admin |
| /owner/categories | OwnerCategories | shop_admin |
| /owner/profile | OwnerProfile | shop_admin |
| /admin/dashboard | AdminDashboard | super_admin |
| /admin/shops | AdminShops | super_admin |
| /admin/users | AdminUsers | super_admin |

## State (Zustand)
- authStore → user + token
- cartStore → cart items (tied to ONE shop)
- shopStore → current shop being viewed
