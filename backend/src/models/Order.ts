// WHAT: Sequelize model for "orders" table
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   user_id      → INTEGER, FK → users
//   total_price  → DECIMAL(10,2)
//   status       → VARCHAR: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
//   address      → TEXT, delivery address
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
// ⚠️ NO items JSONB column — order items are in the order_items table!
