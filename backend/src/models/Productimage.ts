// WHAT: Sequelize model for "product_images" table — one row = one image for one product
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/product.service.ts
// COLUMNS:
//   id                    → SERIAL, Primary Key
//   product_id            → INTEGER, FK → products.id
//   cloudinary_url        → TEXT, full secure URL from Cloudinary
//   cloudinary_public_id  → VARCHAR, UNIQUE, needed to DELETE image from Cloudinary!
//   cloudinary_format     → VARCHAR, image format (jpg, png, webp)
//   cloudinary_width      → INTEGER, image width in pixels
//   cloudinary_height     → INTEGER, image height in pixels
//   is_primary            → BOOLEAN, default false (main thumbnail shown in listings)
//   sort_order            → INTEGER, default 0 (controls display order in gallery)
//   created_at            → TIMESTAMP
// NOTE: this table fixes the 1NF violation — products now have MANY images, not just 1!

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// ProductImage class = blueprint of the product_images table
// each instance of ProductImage = one row = one image belonging to one product
class ProductImage extends Model {
  declare id: number;  // primary key — auto generated     
  declare shop_id: number;
  declare product_id: number;               // which product this image belongs to
  declare cloudinary_url: string;           // full secure URL → "https://res.cloudinary.com/..."
  // used directly in <img src="..." /> tag
  declare cloudinary_public_id: string;     // CRITICAL! → "duhok/products/olive-oil-abc123"
  // needed to DELETE this image from Cloudinary
  // secure_url can change — public_id NEVER changes!
  declare cloudinary_format: string | null; // image format → "jpg", "png", "webp"
  declare cloudinary_width: number | null;  // width in pixels → 800
  declare cloudinary_height: number | null; // height in pixels → 600
  declare is_primary: boolean;              // true = main thumbnail shown in product listings
  // false = extra gallery image
  declare sort_order: number;               // 0 = first, 1 = second, etc.
  // controls gallery display order
}

// ProductImage.init() = tell Sequelize exact columns + rules for this table
ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each image
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,   // whole number — references products.id
      allowNull: false,          // required — every image must belong to a product
    },
    cloudinary_url: {
      type: DataTypes.TEXT,      // full URL → "https://res.cloudinary.com/duhok/..."
      allowNull: false,          // required — the actual image URL we display
    },
    cloudinary_public_id: {
      type: DataTypes.STRING,    // Cloudinary public_id → "duhok/products/abc123"
      allowNull: false,          // required — MUST store this to delete later!
      unique: true,              // each image on Cloudinary has unique public_id
    },
    cloudinary_format: {
      type: DataTypes.STRING,    // "jpg", "png", "webp"
      allowNull: true,           // optional — comes from Cloudinary upload response
    },
    cloudinary_width: {
      type: DataTypes.INTEGER,   // pixels → 800
      allowNull: true,           // optional — comes from Cloudinary upload response
    },
    cloudinary_height: {
      type: DataTypes.INTEGER,   // pixels → 600
      allowNull: true,           // optional — comes from Cloudinary upload response
    },
    is_primary: {
      type: DataTypes.BOOLEAN,   // true or false only
      defaultValue: false,       // must explicitly set one image as primary
    },
    sort_order: {
      type: DataTypes.INTEGER,   // 0, 1, 2, 3...
      defaultValue: 0,           // first image by default
    },
  },
  {
    sequelize,                  // which database connection to use
    modelName: 'ProductImage',  // Sequelize internal model name
    tableName: 'product_images',// exact PostgreSQL table name
    timestamps: true,           // adds created_at + updated_at ✅
    underscored: true               // converts camelCase to snake_case in DB
  }
);

export default ProductImage;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    ProductImage.init() → Sequelize manages "product_images" table in PostgreSQL
    cloudinary_public_id unique → each image is owned by one row only

  CLOUDINARY FLOW:
    vendor uploads image → multer receives file → cloudinary.upload() →
    cloudinary returns { secure_url, public_id, format, width, height } →
    backend stores ALL of these in this table ✅

  WHY WE NEED PUBLIC_ID:
    to delete image: cloudinary.destroy(public_id) ← needs public_id!
    if we only store the URL and vendor deletes product →
    image stays on Cloudinary FOREVER → wasted storage + money! 😱

  SERVICE:
    product.service.ts → ProductImage.findAll({ where: { product_id } })
    product.service.ts → ProductImage.findOne({ where: { product_id, is_primary: true } })
    product.service.ts → cloudinary.destroy(image.cloudinary_public_id) → then image.destroy()

  RELATIONS (defined in models/index.ts):
    ProductImage belongs to Product (via product_id)

  EXAMPLE:
  ─────────
  product_images table in PostgreSQL:
  ┌────┬────────────┬──────────────────────────────┬────────────┬────────────┐
  │ id │ product_id │ cloudinary_url               │ is_primary │ sort_order │
  ├────┼────────────┼──────────────────────────────┼────────────┼────────────┤
  │ 1  │ 1          │ https://res.cloudinary.com/..│ true       │ 0          │ ← main image
  │ 2  │ 1          │ https://res.cloudinary.com/..│ false      │ 1          │ ← gallery
  │ 3  │ 1          │ https://res.cloudinary.com/..│ false      │ 2          │ ← gallery
  └────┴────────────┴──────────────────────────────┴────────────┴────────────┘

  Olive Oil product → 3 images → gallery works perfectly ✅
*/