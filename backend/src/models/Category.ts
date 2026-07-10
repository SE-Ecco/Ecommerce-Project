// WHAT: Sequelize model for "categories" table — product categories per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   name         → VARCHAR
//   created_at   → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Category class = blueprint of categories table
// each instance = one category row belonging to one shop
class Category extends Model {
  declare id: number;       // primary key — auto generated
  declare shop_id: number;  // which shop owns this category — NEVER null
  declare name: string;     // category display name → "Phones", "Olive Oil"
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER, // whole number
      autoIncrement: true,     // database auto-generates: 1, 2, 3...
      primaryKey: true,        // unique identifier for each category
    },
    shop_id: {
      type: DataTypes.INTEGER, // points to shops.id (foreign key)
      allowNull: false,        // required — every category MUST belong to a shop
      references: {
        model: 'shops',        // references the shops table
        key: 'id',             // specifically the id column in shops
      },
      // ⚠️ multi-tenancy: categories are per shop, never global
      // Zaytoon Store categories NEVER show in Duhok Electronics 🔒
    },
    name: {
      type: DataTypes.STRING,  // text value → "Phones", "Spices"
      allowNull: false,        // required — every category must have a name
    },
  },
  {
    sequelize,              // which database connection to use
    modelName: 'Category',  // Sequelize internal model name
    tableName: 'categories', // exact PostgreSQL table name
    timestamps: true,       // auto adds created_at + updated_at columns
  }
);

export default Category; // exported so models/index.ts + services can import it

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Category.init() → Sequelize manages "categories" table in PostgreSQL
    shop_id references shops.id → foreign key constraint at DB level
    if shop deleted → categories deleted too (cascade)

  RELATIONS (defined in models/index.ts):
    Category belongsTo Shop  (via shop_id)
    Shop hasMany Categories  (via shop_id)
    Category hasMany Products (via category_id)

  MULTI-TENANCY:
    every query filters by shop_id:
    Category.findAll({ where: { shop_id: req.user.shop_id } })
    → only returns categories for THAT shop 🔒

  EXAMPLE — categories table:
  ─────────────────────────────
  ┌────┬─────────┬──────────────┐
  │ id │ shop_id │ name         │
  ├────┼─────────┼──────────────┤
  │ 1  │ 1       │ Olive Oil    │  ← Zaytoon Store only
  │ 2  │ 1       │ Spices       │  ← Zaytoon Store only
  │ 3  │ 2       │ Phones       │  ← Duhok Electronics only
  │ 4  │ 2       │ Laptops      │  ← Duhok Electronics only
  └────┴─────────┴──────────────┘

  Zaytoon owner queries → WHERE shop_id = 1 → sees only rows 1, 2 ✅
  Electronics owner queries → WHERE shop_id = 2 → sees only rows 3, 4 ✅
  they NEVER see each other's categories! 🔒
*/
