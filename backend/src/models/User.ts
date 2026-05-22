// WHAT: Sequelize model for "users" table — ALL users in the system
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/auth.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops (NULL for super_admin, NULL for unattached customers)
//   full_name    → VARCHAR
//   email        → VARCHAR, UNIQUE
//   password     → VARCHAR, BCRYPT HASH — never plain text!
//   phone        → VARCHAR (optional)
//   role         → VARCHAR: 'super_admin' | 'shop_admin' | 'customer'
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP
