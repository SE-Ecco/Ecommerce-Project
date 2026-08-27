// WHAT: Sequelize model for "shops" table — one row = one shop/shop
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

// WHAT: Sequelize model for "shops" table — one row = one shop on the platform
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/shop.service.ts
// COLUMNS:
//   id                         → SERIAL, Primary Key
//   name                       → VARCHAR, shop display name
//   slug                       → VARCHAR, UNIQUE, URL-friendly: 'ahmed-store'
//   email                      → VARCHAR, UNIQUE, shop contact email
//   phone                      → VARCHAR, optional shop phone
//   cloudinary_logo_url        → TEXT, Cloudinary image URL for shop logo
//   cloudinary_logo_public_id  → VARCHAR, UNIQUE, Cloudinary public_id (needed for deletion!)
//   status                     → ENUM('active','inactive','suspended'), default 'active'
//   created_at                 → TIMESTAMP
//   updated_at                 → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// shop class = blueprint of the shops table
// each instance of shop = one row = one shop on the platform
class shop extends Model {
  declare id: number;                          // primary key — auto generated
  declare name: string;                        // shop display name → "Ahmed Store"
  declare slug: string;                        // URL-friendly unique name → "ahmed-store"
  declare email: string;                       // shop contact email — must be unique
  declare phone: string | null;                // optional shop phone number
  declare cloudinary_logo_url: string | null;  // Cloudinary URL → "https://res.cloudinary.com/..."
  declare cloudinary_logo_public_id: string | null; // used to DELETE logo from Cloudinary
  declare status: 'active' | 'inactive' | 'suspended'; // active = open | suspended = banned
}

// shop.init() = tell Sequelize exact columns + rules for this table
shop.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each shop
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    name: {
      type: DataTypes.STRING,    // text value → "Ahmed Store"
      allowNull: false,          // required — every shop must have a name
    },
    slug: {
      type: DataTypes.STRING,    // text value → "ahmed-store"
      allowNull: false,          // required — needed for URL routing
      unique: true,              // no two shops can have same slug
                                 // just like Instagram usernames! 🎯
    },
    email: {
      type: DataTypes.STRING,    // text value → "ahmed@store.com"
      allowNull: false,          // required — every shop must have email
      unique: true,              // no two shops can share same email
    },
    phone: {
      type: DataTypes.STRING,    // text value → "07501234567"
      allowNull: true,           // optional — shop may not provide phone
    },
    cloudinary_logo_url: {
      type: DataTypes.TEXT,      // full Cloudinary URL → "https://res.cloudinary.com/..."
      allowNull: true,           // optional — shop may not have logo yet
    },
    cloudinary_logo_public_id: {
      type: DataTypes.STRING,    // Cloudinary public_id → "duhok/shops/logo_abc123"
      allowNull: true,           // optional — only set when logo uploaded
      unique: true,              // each uploaded image has unique public_id on Cloudinary
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'), // only these 3 values allowed
      defaultValue: 'active',    // new shops are active by default ✅
                                 // super_admin can suspend to block a shop 🛑
    },
  },
  {
    sequelize,            // which database connection to use
    modelName: 'shop',  // Sequelize internal model name
    tableName: 'shops', // exact PostgreSQL table name
    timestamps: true,     // auto adds created_at + updated_at columns
    underscored: true,    // converts camelCase to snake_case in DB
  }
);

export default shop;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    shop.init() → Sequelize manages "shops" table in PostgreSQL
    slug unique constraint → database rejects duplicate slugs
    cloudinary_logo_public_id unique → each image has one owner

  SERVICE:
    shop.service.ts → shop.findAll() → get all shops
    shop.service.ts → shop.findOne({ where: { slug } }) → get one shop by URL

  RELATIONS (defined in models/index.ts):
    shop has many Users          (via shop_id)
    shop has many Products       (via shop_id)
    shop has many Orders         (via shop_id)
    shop has one  ShopSettings   (via shop_id)
    shop has many Categories     (via shop_id)
    shop has many FlashSales     (via shop_id)
    shop has many ShippingMethods(via shop_id)

  MULTI-TENANCY:
    shops = CENTER of everything
    every other table has shop_id pointing here
    WHERE shop_id = ? → entire data isolation system 🔒

  CLOUDINARY:
    when vendor uploads logo → backend gets cloudinary_url + public_id from Cloudinary
    we store BOTH in this table
    to delete logo → use public_id to call Cloudinary delete API
    secure_url can change, public_id is STABLE and PERMANENT

  EXAMPLE:
  ─────────
  shops table in PostgreSQL:
  ┌────┬──────────────────┬──────────────────────┬───────────┐
  │ id │ name             │ slug                 │ status    │
  ├────┼──────────────────┼──────────────────────┼───────────┤
  │ 1  │ Ahmed Store      │ ahmed-store          │ active    │
  │ 2  │ Duhok Electronics│ duhok-electronics    │ active    │
  │ 3  │ Old Shop         │ old-shop             │ suspended │
  └────┴──────────────────┴──────────────────────┴───────────┘

  shop.findAll() → returns all 3 rows ✅
  shop.findOne({ where: { slug: "ahmed-store" } }) → returns row 1 ✅
  status: 'suspended' → super_admin blocked this shop 🛑
*/
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