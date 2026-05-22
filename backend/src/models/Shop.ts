// WHAT: Sequelize model for "shops" table — one row = one shop/tenant
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/shop.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   name         → VARCHAR, shop display name
//   slug         → VARCHAR, UNIQUE, URL-friendly: 'zaytoon-store'
//   description  → TEXT, shop description
//   logo_url     → VARCHAR, Cloudinary image URL
//   is_active    → BOOLEAN, default true (super admin can deactivate)
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
