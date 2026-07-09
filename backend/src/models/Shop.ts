// WHAT: Sequelize model for "shops" table — one row = one shop/tenant
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/shop.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   name         → VARCHAR, shop display name
//   slug         → VARCHAR, UNIQUE, URL-friendly: 'zaytoon-store'
//   description  → TEXT, shop description
//   logo_url     → VARCHAR, Cloudinary image URL
//   is_active    → BOOLEAN, default true (super admin can deactivate)
//   created_at   → TIMESTAMP
//   updated_at   → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Shop class = blueprint of the shops table
// each instance of Shop = one row in the shops table
class Shop extends Model {
  declare id: number;           // primary key — auto generated
  declare name: string;         // shop display name → "Zaytoon Store"
  declare slug: string;         // URL-friendly unique name → "zaytoon-store"
  declare description: string;  // optional shop description
  declare logo_url: string;     // optional Cloudinary image URL
  declare is_active: boolean;   // true = open | false = deactivated by super_admin
}

// Shop.init() = tell Sequelize exact columns + rules for this table
Shop.init(
  {
    id: {
      type: DataTypes.INTEGER,  // whole number
      primaryKey: true,         // unique identifier for each shop
      autoIncrement: true,      // database auto-generates: 1, 2, 3...
    },
    name: {
      type: DataTypes.STRING,   // text value → "Zaytoon Store"
      allowNull: false,         // required — every shop must have a name
    },
    slug: {
      type: DataTypes.STRING,   // text value → "zaytoon-store"
      allowNull: false,         // required — needed for URL routing
      unique: true,             // no two shops can have same slug
                                // just like Instagram usernames! 🎯
    },
    description: {
      type: DataTypes.TEXT,     // longer text (TEXT > STRING for descriptions)
      allowNull: true,          // optional — shop may not have description
    },
    logo_url: {
      type: DataTypes.STRING,   // Cloudinary URL → "https://res.cloudinary.com/..."
      allowNull: true,          // optional — shop may not have logo yet
    },
    is_active: {
      type: DataTypes.BOOLEAN,  // true or false only
      defaultValue: true,       // new shops are active by default ✅
                                // super_admin can set to false to deactivate
    },
  },
  {
    sequelize,          // which database connection to use
    modelName: 'Shop',  // Sequelize internal model name
    tableName: 'shops', // exact PostgreSQL table name
    timestamps: true,   // auto adds created_at + updated_at columns
  }
);

export default Shop; // exported so shop.service.ts + models/index.ts can import it

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Shop.init() → Sequelize manages "shops" table in PostgreSQL
    slug unique constraint → database rejects duplicate slugs

  SERVICE:
    shop.service.ts → Shop.findAll() → get all shops
    shop.service.ts → Shop.findOne({ where: { slug } }) → get one shop

  RELATIONS (defined in models/index.ts):
    Shop has many Users    (via shop_id)
    Shop has many Products (via shop_id)
    Shop has many Orders   (via shop_id)

  MULTI-TENANCY:
    shops = CENTER of everything
    every other table has shop_id pointing here
    WHERE shop_id = ? → entire isolation system 🔒

  EXAMPLE:
  ─────────
  shops table in PostgreSQL:
  ┌────┬──────────────────┬──────────────────────┬───────────┐
  │ id │ name             │ slug                 │ is_active │
  ├────┼──────────────────┼──────────────────────┼───────────┤
  │ 1  │ Zaytoon Store    │ zaytoon-store        │ true      │
  │ 2  │ Duhok Electronics│ duhok-electronics    │ true      │
  │ 3  │ Old Shop         │ old-shop             │ false     │
  └────┴──────────────────┴──────────────────────┴───────────┘

  Shop.findAll() → returns all 3 rows ✅
  Shop.findOne({ where: { slug: "zaytoon-store" } }) → returns row 1 ✅
  is_active: false → super_admin deactivated this shop 🛑
*/