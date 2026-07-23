// WHAT: Sequelize models for "wishlists" + "wishlist_items" tables
//       wishlists = named collection created by a user
//       wishlist_items = products saved inside a wishlist
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/wishlist.service.ts
// WISHLIST COLUMNS:
//   id         → SERIAL, Primary Key
//   user_id    → INTEGER, FK → users.id
//   tenant_id  → INTEGER, FK → tenants.id
//   name       → VARCHAR, wishlist name, default 'My Wishlist'
//   created_at → TIMESTAMP
// WISHLIST_ITEM COLUMNS:
//   id          → SERIAL, Primary Key
//   wishlist_id → INTEGER, FK → wishlists.id
//   product_id  → INTEGER, FK → products.id
//   created_at  → TIMESTAMP
// CONSTRAINT: UNIQUE(wishlist_id, product_id) → no duplicate product in same wishlist!

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// ── WISHLIST ─────────────────────────────────────────────────
// each row = one named wishlist created by a user
// user can have MULTIPLE wishlists: "Birthday gifts", "Electronics I want"
export class Wishlist extends Model {
  declare id: number;
  declare user_id: number;    // which user created this wishlist
  declare tenant_id: number;  // which shop this wishlist belongs to
  declare name: string;       // wishlist name → "Birthday gifts", "My Wishlist"
  declare created_at: Date;
}

Wishlist.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'My Wishlist',  // default name if none provided
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: false,
    underscored: true,
  }
);

// ── WISHLIST ITEM ────────────────────────────────────────────
// each row = one product saved inside one wishlist
// UNIQUE(wishlist_id, product_id) → same product can't appear twice in same wishlist
export class WishlistItem extends Model {
  declare id: number;
  declare wishlist_id: number;  // which wishlist this product is saved in
  declare product_id: number;   // which product was saved
  declare created_at: Date;
}

WishlistItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    wishlist_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
    timestamps: false,
    underscored: true,
  }
);