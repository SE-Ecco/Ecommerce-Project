// WHAT: Sequelize model for "product_reviews" table — one row = one customer review
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/review.service.ts
// COLUMNS:
//   id                          → SERIAL, Primary Key
//   product_id                  → INTEGER, FK → products.id
//   user_id                     → INTEGER, FK → users.id
//   tenant_id                   → INTEGER, FK → tenants.id
//   rating                      → INTEGER, 1-5 stars (CHECK constraint in DB)
//   comment                     → TEXT, optional written review
//   cloudinary_photo_url        → TEXT, optional photo attached to review
//   cloudinary_photo_public_id  → VARCHAR, UNIQUE, for deleting review photo
//   created_at                  → TIMESTAMP
//   updated_at                  → TIMESTAMP
// CONSTRAINT: UNIQUE(product_id, user_id) → one review per customer per product!

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// ProductReview class = blueprint of the product_reviews table
// each instance = one customer review left on one product
class ProductReview extends Model {
  declare id: number;                            // primary key — auto generated
  declare product_id: number;                    // which product is being reviewed
  declare user_id: number;                       // which customer left this review
  declare tenant_id: number;                     // which shop this review belongs to
  declare rating: number;                        // star rating → 1, 2, 3, 4, or 5
                                                 // DB has CHECK constraint: rating >= 1 AND rating <= 5
  declare comment: string | null;                // optional written review text
  declare cloudinary_photo_url: string | null;   // optional photo customer attached to review
  declare cloudinary_photo_public_id: string | null; // needed to delete photo from Cloudinary
}

// ProductReview.init() = tell Sequelize exact columns + rules for this table
ProductReview.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each review
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    product_id: {
      type: DataTypes.INTEGER,   // whole number — references products.id
      allowNull: false,          // required — review must be for a specific product
    },
    user_id: {
      type: DataTypes.INTEGER,   // whole number — references users.id
      allowNull: false,          // required — review must have an author
    },
    tenant_id: {
      type: DataTypes.INTEGER,   // whole number — references tenants.id
      allowNull: false,          // required — needed for multi-tenant filtering
    },
    rating: {
      type: DataTypes.INTEGER,   // whole number: 1, 2, 3, 4, or 5
      allowNull: false,          // required — must give a star rating
      validate: {
        min: 1,                  // Sequelize validation: minimum 1 star
        max: 5,                  // Sequelize validation: maximum 5 stars
      },                         // DB also has CHECK constraint as backup 🔒
    },
    comment: {
      type: DataTypes.TEXT,      // longer text for written review
      allowNull: true,           // optional — customer may only leave rating
    },
    cloudinary_photo_url: {
      type: DataTypes.TEXT,      // full Cloudinary URL for review photo
      allowNull: true,           // optional — customer may not attach photo
    },
    cloudinary_photo_public_id: {
      type: DataTypes.STRING,    // Cloudinary public_id for review photo
      allowNull: true,           // optional — only set when photo uploaded
      unique: true,              // each photo has unique public_id on Cloudinary
    },
  },
  {
    sequelize,                    // which database connection to use
    modelName: 'ProductReview',   // Sequelize internal model name
    tableName: 'product_reviews', // exact PostgreSQL table name
    timestamps: true,             // auto adds created_at + updated_at columns
    underscored: true,            // converts camelCase to snake_case in DB
  }
);

export default ProductReview;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    ProductReview.init() → Sequelize manages "product_reviews" table in PostgreSQL
    UNIQUE(product_id, user_id) → in migration → one review per customer per product
    CHECK(rating >= 1 AND rating <= 5) → in migration → DB rejects bad ratings

  SERVICE:
    review.service.ts → ProductReview.findAll({ where: { product_id, tenant_id } })
    review.service.ts → ProductReview.findOne({ where: { product_id, user_id } }) → check if reviewed
    review.service.ts → ProductReview.create({ product_id, user_id, rating, ... })

  RELATIONS (defined in models/index.ts):
    ProductReview belongs to Product (via product_id)
    ProductReview belongs to User    (via user_id)
    ProductReview belongs to Tenant  (via tenant_id)

  EXAMPLE:
  ─────────
  product_reviews table in PostgreSQL:
  ┌────┬────────────┬─────────┬────────┬──────────────────────┐
  │ id │ product_id │ user_id │ rating │ comment              │
  ├────┼────────────┼─────────┼────────┼──────────────────────┤
  │ 1  │ 1          │ 2       │ 5      │ "Best olive oil!"    │
  │ 2  │ 1          │ 4       │ 4      │ "Good quality"       │
  │ 3  │ 2          │ 2       │ 3      │ NULL                 │ ← rating only, no comment
  └────┴────────────┴─────────┴────────┴──────────────────────┘

  user 2 + product 1 → only ONE review allowed (UNIQUE constraint) ✅
*/