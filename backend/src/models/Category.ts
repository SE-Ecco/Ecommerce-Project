// WHAT: Sequelize model for "categories" table — product categories per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id      → INTEGER, FK → shops
//   name         → VARCHAR
//   created_at   → TIMESTAMP

// WHAT: Sequelize model for "categories" table — one row = one product category per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/category.service.ts
// COLUMNS:
//   id                          → SERIAL, Primary Key
//   tenant_id                   → INTEGER, FK → tenants.id
//   name                        → VARCHAR, category display name
//   slug                        → VARCHAR, URL-friendly name (NEW!)
//   parent_id                   → INTEGER, FK → categories.id (NULL = top level)
//   cloudinary_banner_url       → TEXT, banner image URL for category page
//   cloudinary_banner_public_id → VARCHAR, UNIQUE, for deleting banner from Cloudinary
//   created_at                  → TIMESTAMP
//   updated_at                  → TIMESTAMP (NEW!)

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Category class = blueprint of the categories table
// each instance of Category = one row = one category inside one shop
class Category extends Model {
  declare id: number;                               // primary key — auto generated
  declare tenant_id: number;                        // which shop owns this category
  declare name: string;                             // category display name → "Electronics"
  declare slug: string;                             // URL-friendly → "electronics"
                                                    // used in URL: /shop/electronics
  declare parent_id: number | null;                 // NULL = top level category
                                                    // number = subcategory of another category                                              // Electronics → Phones (parent_id = Electronics.id)
  declare cloudinary_banner_url: string | null;     // banner image shown on category page
  declare cloudinary_banner_public_id: string | null; // needed to delete banner from Cloudinary
}

// Category.init() = tell Sequelize exact columns + rules for this table
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each category
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    tenant_id: {
      type: DataTypes.INTEGER,   // whole number — references tenants.id
      allowNull: false,          // required — every category must belong to a shop
    },
    name: {
      type: DataTypes.STRING,    // text value → "Electronics"
      allowNull: false,          // required — every category must have a name
    },
    slug: {
      type: DataTypes.STRING,    // text value → "electronics"
      allowNull: false,          // required — needed for URL routing
                                 // example: duhok.com/shop/electronics
    },
    parent_id: {
      type: DataTypes.INTEGER,   // references another category's id
      allowNull: true,           // NULL = this IS a top-level category
                                 // has value = this is a subcategory
    },
    cloudinary_banner_url: {
      type: DataTypes.TEXT,      // full Cloudinary URL for category banner image
      allowNull: true,           // optional — category may not have banner
    },
    cloudinary_banner_public_id: {
      type: DataTypes.STRING,    // Cloudinary public_id → "duhok/categories/banner_abc"
      allowNull: true,           // optional — only set when banner uploaded
      unique: true,              // each uploaded image has unique public_id on Cloudinary
    },
  },
  {
    sequelize,               // which database connection to use
    modelName: 'Category',   // Sequelize internal model name
    tableName: 'categories', // exact PostgreSQL table name
    timestamps: true,        // auto adds created_at + updated_at columns ✅
    underscored: true,       // converts camelCase to snake_case in DB
  }
);

export default Category;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Category.init() → Sequelize manages "categories" table in PostgreSQL
    parent_id self-reference → categories can be nested inside each other

  SERVICE:
    category.service.ts → Category.findAll({ where: { tenant_id } }) → get all categories for shop
    category.service.ts → Category.findAll({ where: { parent_id: null } }) → get top-level only

  RELATIONS (defined in models/index.ts):
    Category belongs to Tenant              (via tenant_id)
    Category has many Products              (via category_id)
    Category has many Subcategories         (via parent_id) ← self-reference!
    Category belongs to Parent Category     (via parent_id) ← self-reference!

  HIERARCHICAL EXAMPLE:
    Electronics    → parent_id = NULL  (top level)
      Phones       → parent_id = 1     (sub of Electronics)
      Laptops      → parent_id = 1     (sub of Electronics)
    Food           → parent_id = NULL  (top level)
      Oils         → parent_id = 4     (sub of Food)

  MULTI-TENANCY:
    Ahmed Store has: Food, Oils, Spices
    Duhok Electronics has: Electronics, Phones, Laptops
    WHERE tenant_id = 1 → only Ahmed's categories ✅

  EXAMPLE:
  ─────────
  categories table in PostgreSQL:
  ┌────┬───────────┬─────────────┬──────────────┬───────────┐
  │ id │ tenant_id │ name        │ slug         │ parent_id │
  ├────┼───────────┼─────────────┼──────────────┼───────────┤
  │ 1  │ 1         │ Food        │ food         │ NULL      │
  │ 2  │ 1         │ Oils        │ oils         │ 1         │
  │ 3  │ 3         │ Electronics │ electronics  │ NULL      │
  │ 4  │ 3         │ Phones      │ phones       │ 3         │
  └────┴───────────┴─────────────┴──────────────┴───────────┘
*/ // exported so models/index.ts + services can import it

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
