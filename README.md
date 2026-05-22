# 🛒 Duhok Multi-Tenant E-Commerce

Multi-tenant platform — many shops, one system.

## 🚀 Quick Start
```bash
pnpm install          # install all
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp database/.env.example database/.env
pnpm dev              # run frontend + backend together
```

## 📁 Structure
| Folder     | Who works here              | Tech |
|------------|-----------------------------|------|
| frontend/  | Zhegr + Rasheed + Ahmed     | React + TS + Vite |
| backend/   | Jiwar + Alan                | Node + Express + TS |
| database/  | Dlawar + Obaida + Khalil    | Sequelize CLI + PostgreSQL |
| docs/      | Everyone                    | Markdown |
| tests/     | Everyone                    | Jest + Playwright |

## 🏪 Multi-Tenant
Every shop is identified by a unique slug:
- duhok-market.com/shops/zaytoon-store
- duhok-market.com/shops/duhok-electronics

## 👥 Roles (Hybrid System)
| Role        | Access |
|-------------|--------|
| super_admin | All shops, all users, platform management |
| shop_admin  | Only their shop's products, orders, categories |
| customer    | Browse any shop, add to cart, place orders |

## 🗄️ Database Tables (6 tables)
| Table       | Description |
|-------------|-------------|
| shops       | One row per shop (tenant) |
| users       | All users (super_admin, shop_admin, customer) |
| categories  | Product categories per shop |
| products    | Products linked to shop + category |
| orders      | Customer orders with delivery address |
| order_items | Individual items in each order |
