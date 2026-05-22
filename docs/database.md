# 🗄️ Database Documentation
**Written by:** Dlawar + Obaida + Khalil team

## How to Run
```bash
cd database
cp .env.example .env    # fill your PostgreSQL values
pnpm migrate            # create 6 tables
pnpm seed               # insert test data
```

## Tables (6 total)
| Table       | Description | Key Columns |
|-------------|-------------|-------------|
| shops       | One row per shop (tenant) | name, slug, logo_url, is_active |
| users       | All platform users | full_name, email, phone, role, shop_id |
| categories  | Product categories per shop | name, shop_id |
| products    | Products linked to shop + category | price, stock, is_available |
| orders      | Customer orders with delivery address | status, address, total_price |
| order_items | Individual items in each order | quantity, unit_price (snapshot) |

## Roles
| Role | shop_id | Access |
|------|---------|--------|
| super_admin | NULL | Manages all shops + users |
| shop_admin | Set to their shop | Manages their shop only |
| customer | NULL | Browses and buys from any shop |

## ER Diagram
<!-- Draw on dbdiagram.io and paste the link here -->

## Migration Order
```
01-create-shops       ← first (no dependencies)
02-create-users       ← after shops (FK: shop_id)
03-create-categories  ← after shops (FK: shop_id)
04-create-products    ← after shops + categories (FK: shop_id, category_id)
05-create-orders      ← after shops + users (FK: shop_id, user_id)
06-create-order-items ← LAST (FK: shop_id, order_id, product_id)
```
