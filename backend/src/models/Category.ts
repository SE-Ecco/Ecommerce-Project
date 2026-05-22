// WHAT: Sequelize model for "categories" table — product categories per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/category.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   name         → VARCHAR
//   created_at   → TIMESTAMP
