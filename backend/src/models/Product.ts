// WHAT: Sequelize model for "products" table
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts, services/order.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops (required)
//   category_id  → INTEGER, FK → categories (optional)
//   name         → VARCHAR
//   description  → TEXT
//   price        → DECIMAL(10,2)
//   stock        → INTEGER, default 0
//   image_url    → VARCHAR, Cloudinary URL
//   is_available → BOOLEAN, default true
//   created_at   → TIMESTAMP (auto)
//   updated_at   → TIMESTAMP (auto)

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Product class = blueprint of products table
// each instance = one product row belonging to one shop
class Product extends Model {
  declare id: number;           // primary key — auto generated
  declare shop_id: number;      // which shop sells this — REQUIRED 🔒
  declare category_id: number;  // which category — optional
  declare name: string;         // product name → "Olive Oil"
  declare description: string;  // optional product description
  declare price: number;        // price in IQD → 5000.00
  declare stock: number;        // how many items available
  declare image_url: string;    // Cloudinary URL → optional
  declare is_available: boolean; // true = can buy | false = hidden by owner
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,  // whole number
      autoIncrement: true,      // database auto-generates: 1, 2, 3...
      primaryKey: true,         // unique identifier for each product
    },
    shop_id: {
      type: DataTypes.INTEGER,  // points to shops.id
      allowNull: false,         // REQUIRED — every product MUST belong to a shop 🔒
      references: {
        model: 'shops',         // references shops table
        key: 'id',              // specifically the id column
      },
    },
    category_id: {
      type: DataTypes.INTEGER,  // points to categories.id
      allowNull: true,          // OPTIONAL — product may have no category
      references: {
        model: 'categories',    // references categories table
        key: 'id',              // specifically the id column
      },
    },
    name: {
      type: DataTypes.STRING,   // text value → "Olive Oil"
      allowNull: false,         // required — every product must have a name
    },
    description: {
      type: DataTypes.TEXT,     // longer text (TEXT > STRING for descriptions)
      allowNull: true,          // optional — product may not have description
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // up to 10 digits, 2 decimal places
      // why DECIMAL not INTEGER?     // 5000.50 IQD needs decimals!
      // DECIMAL(10,2) = max 99999999.99
      allowNull: false,               // required — every product must have price
    },
    stock: {
      type: DataTypes.INTEGER,  // whole number — can't have 0.5 items!
      allowNull: false,         // required
      defaultValue: 0,          // new products start with 0 stock
    },
    image_url: {
      type: DataTypes.STRING,   // Cloudinary URL → "https://res.cloudinary.com/..."
      allowNull: true,          // optional — product may not have image yet
    },
    is_available: {
      type: DataTypes.BOOLEAN,  // true or false only
      allowNull: false,         // required
      defaultValue: true,       // new products are available by default ✅
      // shop owner sets to false → hides from customers
      // different from stock = 0 (manual control vs quantity)
    },
  },
  {
    sequelize,             // which database connection to use
    modelName: 'Product',  // Sequelize internal model name
    tableName: 'products', // exact PostgreSQL table name
    timestamps: true,      // auto adds created_at + updated_at ✅
  }
);

export default Product; // exported so models/index.ts + services can import it

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Product.init() → Sequelize manages "products" table in PostgreSQL
    shop_id → foreign key → shops table (required)
    category_id → foreign key → categories table (optional)

  RELATIONS (defined in models/index.ts):
    Product belongsTo Shop     (via shop_id)
    Product belongsTo Category (via category_id)
    Shop hasMany Products      (via shop_id)
    Category hasMany Products  (via category_id)

  MULTI-TENANCY:
    shop_id on every product = entire isolation system
    product.service always queries:
    Product.findAll({ where: { shop_id: req.user.shop_id } })
    → Zaytoon owner NEVER sees Duhok Electronics products 🔒

  stock vs is_available:
    stock = 5, is_available = true  → normal, can buy ✅
    stock = 5, is_available = false → owner hid it temporarily 🙈
    stock = 0, is_available = false → out of stock ❌

  DECIMAL(10, 2):
    10 = total digits allowed
    2  = digits after decimal point
    max value = 99,999,999.99 IQD ✅

  EXAMPLE — products table:
  ──────────────────────────
  ┌────┬─────────┬─────────────┬───────────┬───────┬───────┬──────────────┐
  │ id │ shop_id │ category_id │ name      │ price │ stock │ is_available │
  ├────┼─────────┼─────────────┼───────────┼───────┼───────┼──────────────┤
  │ 1  │ 1       │ 1           │ Olive Oil │ 5000  │ 100   │ true         │
  │ 2  │ 1       │ 2           │ Spices    │ 1000  │ 50    │ true         │
  │ 3  │ 2       │ 3           │ iPhone    │ 500000│ 5     │ true         │
  └────┴─────────┴─────────────┴───────────┴───────┴───────┴──────────────┘

  Zaytoon queries → WHERE shop_id = 1 → rows 1, 2 only ✅
  Electronics queries → WHERE shop_id = 2 → row 3 only ✅
*/
