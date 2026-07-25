// WHAT: Sequelize models for "tags" + "product_tags" tables
//       tags = master list of searchable tags per shop
//       product_tags = bridge table (many-to-many: products ↔ tags)
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// TAG COLUMNS:
//   id         → SERIAL, Primary Key
//   shop_id  → INTEGER, FK → shops.id
//   name       → VARCHAR, tag name (UNIQUE per shop)
//   created_at → TIMESTAMP
// PRODUCT_TAG COLUMNS:
//   id         → SERIAL, Primary Key
//   product_id → INTEGER, FK → products.id
//   tag_id     → INTEGER, FK → tags.id

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// ── TAG ─────────────────────────────────────────────────────
// each row = one tag that belongs to one shop
// example: Ahmed Store has tags: "organic", "local", "fresh"
export class Tag extends Model {
  declare id: number;
  declare shop_id: number;   // which shop owns this tag
  declare name: string;        // tag label → "organic", "local", "fresh"
                               // UNIQUE per shop (no duplicate tags in same shop)
  declare created_at: Date;
}

Tag.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    name: {
      type: DataTypes.STRING,
      allowNull: false,        // required — tag must have a name
    },
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: false,
    underscored: true,
  }
);

// ── PRODUCT TAG (bridge table) ───────────────────────────────
// each row = one connection between one product and one tag
// Olive Oil → tags: organic, local, food (3 rows in this table)
// one product can have many tags
// one tag can belong to many products
export class ProductTag extends Model {
  declare id: number;
  declare product_id: number;  // which product
  declare tag_id: number;      // which tag
                               // UNIQUE(product_id, tag_id) in DB → no duplicate connections
}

ProductTag.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    tag_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'product_tags',
    timestamps: false,
    underscored: true,
  }
);