// WHAT: Sequelize models for "orders" + "order_items" tables
//       orders = one customer order (the receipt header)
//       order_items = individual products inside that order (the receipt lines)
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/order.service.ts
// ORDER COLUMNS:
//   id              → SERIAL, Primary Key
//   tenant_id       → INTEGER, FK → tenants.id
//   user_id         → INTEGER, FK → users.id
//   address_id      → INTEGER, FK → addresses.id (nullable)
//   status          → ENUM, order lifecycle stage
//   total_amount    → DECIMAL(10,2), final amount paid
//   discount_amount → DECIMAL(10,2), how much was discounted
//   notes           → TEXT, optional customer note
//   created_at      → TIMESTAMP
//   updated_at      → TIMESTAMP
// ORDER_ITEM COLUMNS:
//   id         → SERIAL, Primary Key
//   order_id   → INTEGER, FK → orders.id
//   product_id → INTEGER, FK → products.id
//   variant_id → INTEGER, FK → product_variants.id (nullable)
//   quantity   → INTEGER
//   unit_price → DECIMAL(10,2), PRICE SNAPSHOT at time of purchase! 📸
//   created_at → TIMESTAMP

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// ── ORDER ────────────────────────────────────────────────────
// each row = one complete customer order
// think of it as a receipt HEADER (date, total, status)
export class Order extends Model {
  declare id: number;
  declare tenant_id: number;         // which shop received this order
  declare user_id: number;           // which customer placed this order
  declare address_id: number | null; // delivery address (nullable — may be pickup)
  declare status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  declare total_amount: number;      // final total the customer paid
  declare discount_amount: number;   // how much discount was applied (0 if none)
  declare notes: string | null;      // optional customer note → "please call before delivery"
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    address_id: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending','confirmed','processing','shipped','delivered','cancelled'),
      allowNull: false,
      defaultValue: 'pending',       // all orders start as pending ✅
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,            // 0 if no discount applied
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

// ── ORDER ITEM ───────────────────────────────────────────────
// each row = one product line in one order
// think of it as a receipt LINE (product, qty, price)
export class OrderItem extends Model {
  declare id: number;
  declare order_id: number;          // which order this line belongs to
  declare product_id: number;        // which product was ordered
  declare variant_id: number | null; // which variant (size/color) if applicable
  declare quantity: number;          // how many units were ordered
  declare unit_price: number;        // PRICE SNAPSHOT 📸
                                     // the price AT THE MOMENT of purchase
                                     // even if vendor changes price later →
                                     // old orders still show the ORIGINAL price ✅
                                     // NEVER reference products.price for history!
}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,              // required — must snapshot price at checkout!
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: false,
    underscored: true,
  }
);