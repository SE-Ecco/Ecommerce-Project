// WHAT: Sequelize model for "product_variants" table — one row = one variation of a product
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// COLUMNS:
//   id          → SERIAL, Primary Key
//   product_id  → INTEGER, FK → products.id
//   name        → VARCHAR, variant display name
//   sku         → VARCHAR, UNIQUE, stock keeping unit code
//   price       → DECIMAL(10,2), price override (NULL = use parent product price)
//   stock       → INTEGER, variant-specific stock quantity
//   attributes  → JSONB, variant properties (size, color, etc.)
//   is_active   → BOOLEAN, default true
//   deleted_at  → TIMESTAMP, soft delete (NEW!)
//   created_at  → TIMESTAMP
//   updated_at  → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// ProductVariant class = blueprint of the product_variants table
// each instance = one variation of the same product (size L red, size M blue, etc.)
class ProductVariant extends Model {
  declare id: number;               // primary key — auto generated
  declare shop_id: number;             
  declare product_id: number;      // which product this variant belongs to
  declare name: string;            // variant display name → "Size L - Red"
  declare sku: string | null;      // stock keeping unit → "SHIRT-L-RED-001"
  // used for inventory tracking, must be unique
  declare price: number | null;    // price override for this variant
  // NULL = use the parent product's price
  // has value = this variant has different price
  declare stock: number;           // how many units of THIS variant are available
  declare attributes: object | null; // JSONB variant properties
  // {"size": "L", "color": "red", "material": "cotton"}
  declare is_active: boolean;      // true = visible | false = hidden by vendor
  declare deleted_at: Date | null; // soft delete: NULL = exists | date = deleted
  // same pattern as products table for consistency
}

// ProductVariant.init() = tell Sequelize exact columns + rules for this table
ProductVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,     // whole number
      primaryKey: true,            // unique identifier for each variant
      autoIncrement: true,         // database auto-generates: 1, 2, 3...
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,     // whole number — references products.id
      allowNull: false,            // required — every variant must belong to a product
    },
    name: {
      type: DataTypes.STRING,      // text value → "Size L - Red"
      allowNull: false,            // required — every variant must have a name
    },
    sku: {
      type: DataTypes.STRING,      // text value → "SHIRT-L-RED-001"
      allowNull: true,             // optional — not every shop uses SKUs
      unique: true,                // if provided, must be unique across all variants
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // 10 digits, 2 after decimal
      allowNull: true,             // NULL = use parent product price
      // value = this variant costs differently
    },
    stock: {
      type: DataTypes.INTEGER,     // whole number — variant-specific stock
      allowNull: false,            // required — must track stock per variant
      defaultValue: 0,             // new variants start with 0 stock
    },
    attributes: {
      type: DataTypes.JSONB,       // flexible JSON → {"size": "L", "color": "red"}
      allowNull: true,             // optional — depends on product type
    },
    is_active: {
      type: DataTypes.BOOLEAN,     // true or false only
      defaultValue: true,          // new variants are visible by default ✅
    },
    deleted_at: {
      type: DataTypes.DATE,        // timestamp of when variant was "deleted"
      allowNull: true,             // NULL = variant exists
      // has value = variant soft deleted
      // ALWAYS filter: WHERE deleted_at IS NULL
    },
  },
  {
    sequelize,                     // which database connection to use
    modelName: 'ProductVariant',   // Sequelize internal model name
    tableName: 'product_variants', // exact PostgreSQL table name
    timestamps: true,              // auto adds created_at + updated_at columns
    underscored: true,             // converts camelCase to snake_case in DB
  }
);

export default ProductVariant;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    ProductVariant.init() → Sequelize manages "product_variants" table in PostgreSQL
    sku unique → no two variants can share same inventory code

  SERVICE:
    product.service.ts → ProductVariant.findAll({ where: { product_id, deleted_at: null } })

  RELATIONS (defined in models/index.ts):
    ProductVariant belongs to Product    (via product_id)
    ProductVariant has many CartItems    (via variant_id)
    ProductVariant has many OrderItems   (via variant_id)

  HOW VARIANTS WORK:
    Parent product: T-Shirt → price: 25000 IQD (default)
    Variant 1: Size S - White → price: NULL (uses 25000), stock: 10
    Variant 2: Size L - Red   → price: 30000 (override!), stock: 5
    Variant 3: Size XL - Blue → price: NULL (uses 25000), stock: 0

  EXAMPLE:
  ─────────
  product_variants table in PostgreSQL:
  ┌────┬────────────┬─────────────────┬───────┬────────┬────────────┐
  │ id │ product_id │ name            │ price │ stock  │ deleted_at │
  ├────┼────────────┼─────────────────┼───────┼────────┼────────────┤
  │ 1  │ 5          │ Size S - White  │ NULL  │ 10     │ NULL       │ ← active ✅
  │ 2  │ 5          │ Size L - Red    │ 30000 │ 5      │ NULL       │ ← active ✅
  │ 3  │ 5          │ Discontinued    │ NULL  │ 0      │ 2026-05-01 │ ← deleted 🗑️
  └────┴────────────┴─────────────────┴───────┴────────┴────────────┘
*/