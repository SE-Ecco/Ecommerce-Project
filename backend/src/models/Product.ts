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

// WHAT: Sequelize model for "products" table — one row = one product in one shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// COLUMNS:
//   id          → SERIAL, Primary Key
//   tenant_id   → INTEGER, FK → tenants.id
//   category_id → INTEGER, FK → categories.id (nullable)
//   name        → VARCHAR, product name
//   description → TEXT, product description
//   price       → DECIMAL(10,2), base price in IQD
//   stock       → INTEGER, available quantity, default 0
//   is_active   → BOOLEAN, default true (vendor can hide product)
//   deleted_at  → TIMESTAMP, NULL = exists | timestamp = soft deleted
//   attributes  → JSONB, flexible extra data (weight, brand, etc.)
//   created_at  → TIMESTAMP
//   updated_at  → TIMESTAMP
// NOTE: NO image_url here! images live in product_images table (1NF fix!)

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Product class = blueprint of the products table
// each instance of Product = one row = one product inside one shop
class Product extends Model {
  declare id: number;              // primary key — auto generated
  declare tenant_id: number;       // which shop owns this product
  declare category_id: number | null; // which category — optional
  declare name: string;            // product name → "Olive Oil 1L"
  declare description: string | null; // optional product description
  declare price: number;           // base price in IQD → 15000.00
                                   // ALWAYS use DECIMAL — never FLOAT for money!
  declare stock: number;           // how many units available right now
  declare is_active: boolean;      // true = visible | false = hidden by vendor
  declare deleted_at: Date | null; // soft delete: NULL = exists | date = deleted
                                   // we never hard delete products (keeps order history!)
  declare attributes: object | null; // JSONB flexible data
                                     // food: {"weight": "500g", "expiry": "2025-12"}
                                     // electronics: {"warranty": "1 year"}
}

// Product.init() = tell Sequelize exact columns + rules for this table
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,     // whole number
      primaryKey: true,            // unique identifier for each product
      autoIncrement: true,         // database auto-generates: 1, 2, 3...
    },
    tenant_id: {
      type: DataTypes.INTEGER,     // whole number — references tenants.id
      allowNull: false,            // required — every product must belong to a shop
    },
    category_id: {
      type: DataTypes.INTEGER,     // whole number — references categories.id
      allowNull: true,             // optional — product may not be in any category
    },
    name: {
      type: DataTypes.STRING,      // text value → "Olive Oil 1L"
      allowNull: false,            // required — every product must have a name
    },
    description: {
      type: DataTypes.TEXT,        // longer text for detailed product description
      allowNull: true,             // optional — product may not have description
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 after decimal → 99999999.99
      allowNull: false,            // required — every product must have price
    },
    stock: {
      type: DataTypes.INTEGER,     // whole number — quantity available
      allowNull: false,            // required — must track stock
      defaultValue: 0,             // new products start with 0 stock
    },
    is_active: {
      type: DataTypes.BOOLEAN,     // true or false only
      defaultValue: true,          // new products are visible by default ✅
    },
    deleted_at: {
      type: DataTypes.DATE,        // timestamp of when product was "deleted"
      allowNull: true,             // NULL = product exists and is real
                                   // has value = product was soft deleted
                                   // ALWAYS filter: WHERE deleted_at IS NULL
    },
    attributes: {
      type: DataTypes.JSONB,       // flexible JSON stored in PostgreSQL
      allowNull: true,             // optional — not every product has extra attributes
    },
  },
  {
    sequelize,             // which database connection to use
    modelName: 'Product',  // Sequelize internal model name
    tableName: 'products', // exact PostgreSQL table name
    timestamps: true,      // auto adds created_at + updated_at columns
    underscored: true,     // converts camelCase to snake_case in DB
  }
);

export default Product;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Product.init() → Sequelize manages "products" table in PostgreSQL
    deleted_at = soft delete pattern (product hidden, not destroyed)

  CRITICAL RULE 🚨 — ALWAYS filter soft-deleted products:
    Product.findAll({ where: { tenant_id, deleted_at: null } }) ✅
    Product.findAll({ where: { tenant_id } }) ← shows deleted products! ❌

  SERVICE:
    product.service.ts → Product.findAll({ where: { tenant_id, deleted_at: null } })
    product.service.ts → Product.create({ tenant_id, name, price, ... })
    product.service.ts → product.update({ deleted_at: new Date() }) → soft delete

  RELATIONS (defined in models/index.ts):
    Product belongs to Tenant        (via tenant_id)
    Product belongs to Category      (via category_id)
    Product has many ProductImages   (via product_id)
    Product has many ProductVariants (via product_id)
    Product has many ProductReviews  (via product_id)
    Product has many ProductViews    (via product_id)
    Product has many FlashSales      (via product_id)
    Product belongs to many Orders   (through order_items)
    Product belongs to many Tags     (through product_tags)

  WHY NO IMAGE_URL HERE:
    old design: products.image_url → only 1 image per product ❌
    new design: product_images table → unlimited images per product ✅
    this is a normalization fix (1NF — no hidden lists in one column!)

  EXAMPLE:
  ─────────
  products table in PostgreSQL:
  ┌────┬───────────┬──────────────┬───────────┬────────────┐
  │ id │ tenant_id │ name         │ price     │ deleted_at │
  ├────┼───────────┼──────────────┼───────────┼────────────┤
  │ 1  │ 1         │ Olive Oil 1L │ 15000.00  │ NULL       │ ← exists ✅
  │ 2  │ 1         │ Old Product  │ 5000.00   │ 2026-01-15 │ ← deleted 🗑️
  └────┴───────────┴──────────────┴───────────┴────────────┘
*/ // exported so models/index.ts + services can import it

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
