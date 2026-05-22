// WHAT: Sequelize model for "order_items" table — individual items in each order
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops (for multi-tenancy filtering)
//   order_id     → INTEGER, FK → orders
//   product_id   → INTEGER, FK → products
//   quantity     → INTEGER
//   unit_price   → DECIMAL(10,2), price at time of purchase (snapshot!)
// ⚠️ unit_price is a SNAPSHOT — product.price can change later but this stays fixed
