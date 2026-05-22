// WHAT: Sequelize model for "products" table
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   category_id  → INTEGER, FK → categories
//   name         → VARCHAR
//   description  → TEXT
//   price        → DECIMAL(10,2)
//   stock        → INTEGER
//   image_url    → VARCHAR, Cloudinary URL
//   is_available → BOOLEAN, default true
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
