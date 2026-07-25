// WHAT: Sequelize model for "cart_items" table — persistent cart for logged-in users
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/cart.service.ts
// COLUMNS:
//   id         → SERIAL, Primary Key
//   user_id    → INTEGER, FK → users.id
//   shop_id  → INTEGER, FK → shops.id
//   product_id → INTEGER, FK → products.id
//   variant_id → INTEGER, FK → product_variants.id (nullable)
//   quantity   → INTEGER, default 1
//   created_at → TIMESTAMP
//   updated_at → TIMESTAMP
// CONSTRAINT: UNIQUE(user_id, product_id, variant_id) → no duplicate items in cart!
// NOTE: guest cart stays in browser (Zustand) — this table is for logged-in users only!

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// CartItem class = blueprint of the cart_items table
// each instance = one product (with optional variant) in one user's cart
class CartItem extends Model {
  declare id: number;
  declare user_id: number;          // which user's cart this belongs to
  declare shop_id: number;        // which shop's cart (multi-shop isolation!)
  declare product_id: number;       // which product is in the cart
  declare variant_id: number | null; // which specific variant (size, color)
                                     // NULL = no variant, just the base product
  declare quantity: number;          // how many units → 2 bottles of olive oil
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,             // NULL = base product (no specific variant)
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,             // start with quantity 1
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
  }
);

export default CartItem;

/*
  WHY THIS TABLE EXISTS:
  ─────────────────────────────────────────────────────────────────
  guest user:  cart lives in browser only (Zustand store) → no DB
  logged-in:   cart lives here in DB → works across all devices!

  customer adds to cart on phone → opens laptop → cart still there ✅
  this is exactly how Amazon works! 🎯

  WHEN CUSTOMER CHECKS OUT:
  cart_items → create order → create order_items → clear cart_items ✅
*/