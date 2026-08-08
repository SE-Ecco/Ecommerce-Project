// WHAT: Business logic for products — CRUD operations
// IMPORTS: models/Product.ts, models/Category.ts
// USED BY: controllers/product.controller.ts
// ⚠️ SECURITY: Always filters by shop_id — shop owner can only touch THEIR products!

import Product from '../models/Product';   // Sequelize model — talks to products table
import Category from '../models/Category'; // needed for product queries with category info
import ProductVariant from '../models/Productvariant';
import ProductImage from '../models/Productimage';
import cloudinary from '../config/cloudinary';
import 'multer'; // makes Express.Multer.File type available
import { Tag, ProductTag} from '../models/Tag-ProductTag'
import  FlashSale from '../models/Flashsale';
import { Op } from 'sequelize';
// ===========================
// GET ALL PRODUCTS
// ===========================

export const getProducts = async (shop_id: number) => {
  // findAll with shop_id filter → only returns THIS shop's products
  // never returns other shops products 🔒
  return await Product.findAll({
    where: { shop_id, deleted_at: null }, // shorthand for { shop_id: shop_id }
  });
};

// ===========================
// GET ONE PRODUCT
// ===========================

export const getProductById = async (id: number, shop_id: number) => {
  // findOne with BOTH id AND shop_id → double security check
  // even if hacker knows product id → shop_id filter blocks them 🔒
  const product = await Product.findOne({
    where: { id, shop_id, deleted_at: null },
  });

  if (!product) throw new Error('Product not found');
  // null returned → product doesn't exist OR belongs to different shop
  // same message for both → hacker learns nothing 🔒

  return product;
};

// ===========================
// CREATE PRODUCT
// ===========================

export const createProduct = async (
  shop_id: number,
  data: {
    name: string;
    price: number;
    stock: number;
    description?: string;  // optional
    category_id?: number;  // optional
  }
) => {
  // spread operator → { shop_id, name, price, stock, ... }
  // shop_id always from JWT token — never from request body! 🔒
  return await Product.create({ shop_id, ...data });
};

// ===========================
// UPDATE PRODUCT
// ===========================

export const updateProduct = async (
  id: number,
  shop_id: number,
  data: object // partial update — any combination of fields
) => {
  // first find product → throws if not found or wrong shop 🔒
  const product = await getProductById(id, shop_id);

  // update() → only changes fields provided in data
  // other fields stay the same ✅
  await product.update(data);

  return product; // returns updated product
};

// ===========================
// DELETE PRODUCT
// ===========================

export const deleteProduct = async (id: number, shop_id: number) => {
  // first find product → throws if not found or wrong shop 🔒
  const product = await getProductById(id, shop_id);

  // destroy() → DELETE FROM products WHERE id = ?
  await product.update({ deleted_at: new Date() }); // soft delete 🔧

  return { message: 'Product deleted successfully' };
};

export const getVariantsByProduct = async (product_id: number, shop_id: number) => {
  return await ProductVariant.findAll({
    where: { product_id, shop_id, deleted_at: null },
  });
};
// ===========================
// PRODUCT VARIANT 
// ===========================

export const createVariant = async (
  product_id: number,
  shop_id: number,
  data: {
    name: string;
    sku?: string;
    price?: number;
    stock?: number;
    attributes?: object;
  }
) => {
  await getProductById(product_id, shop_id);
  return await ProductVariant.create({ product_id, shop_id, ...data });
};

export const updateVariant = async (id: number, shop_id: number, data: object) => {
  const variant = await ProductVariant.findOne({
    where: { id, shop_id, deleted_at: null }
  });
  if (!variant) throw new Error('Variant not found');
  await variant.update(data);
  return variant;
};

export const deleteVariant = async (id: number, shop_id: number) => {
  const variant = await ProductVariant.findOne({
    where: { id, shop_id, deleted_at: null }
  });
  if (!variant) throw new Error('Variant not found');
  await variant.update({ deleted_at: new Date() });
  return { message: 'Variant deleted successfully' };
};


// ===========================
// PRODUCT IMAGES
// ===========================


// GET ALL IMAGES FOR A PRODUCT
export const getProductImages = async (product_id: number, shop_id: number) => {
  return await ProductImage.findAll({
    where: { product_id, shop_id },
    order: [['sort_order', 'ASC']] // first image first
  });
};

// ADD IMAGE
export const addProductImage = async (
  product_id: number,
  shop_id: number,
  file: { path: string; filename: string },
  is_primary: boolean = false
) => {
  await getProductById(product_id, shop_id); // verify ownership 🔒
  return await ProductImage.create({
    product_id,
    shop_id,
    cloudinary_url: file.path,
    cloudinary_public_id: file.filename,
    is_primary,
  });
};

// SET PRIMARY IMAGE
export const setPrimaryImage = async (id: number, product_id: number, shop_id: number) => {
  await getProductById(product_id, shop_id); // verify ownership 🔒
  await ProductImage.update(
    { is_primary: false  },             // reset ALL images
    { where: { product_id, shop_id } }
  );
  await ProductImage.update(
    { is_primary: true },             // set THIS one as primary
    { where: { id, product_id, shop_id } }
  );
};

// DELETE IMAGE
export const deleteProductImage = async (id: number, shop_id: number) => {
  const image = await ProductImage.findOne({
    where: { id, shop_id }
  });
  if (!image) throw new Error('Image not found');
  await cloudinary.uploader.destroy(image.cloudinary_public_id); // delete from Cloudinary first!
  await image.destroy();                             // then delete from DB
  return { message: 'Image deleted successfully' };
};


/*
  ==========================
  PRODUCT TAG
  ==========================
*/

export const addTagsToProduct = async(
  productId: number,
  shopId: number,
  tagNames: string[]
) => {
  for(const name of tagNames){
    let tag = await Tag.findOne({
      where: {
        shop_id: shopId,
        name: name
      }
    });

    if (!tag){
      tag = await Tag.create({
        shop_id: shopId,
        name: name
      });
    }
    await ProductTag.create({
      product_id: productId,
      tag_id: tag.id
    });
  }
};

export const getProductsByTag = async(
  tagName: string,
  shopId: number
) => {
  const tag = await Tag.findOne({
    where: {
      name: tagName,
      shop_id: shopId
    }
  });

  if (!tag) return [];

  return await Product.findAll({
    where: {
      shop_id: shopId,
      deleted_at: null
    },
    include: [{
      model: Tag,
      as: 'tags',
      where: { id: tag.id },
      through: { attributes: [] }
    }]
  });
};

/*
  =========================
  Flash sales
  =========================

*/

export const createFlashSale = async (
    shopId: number,
    productId: number,
    discountPct: number,
    startsAt: Date,
    endsAt: Date
) => {
    return await FlashSale.create({
        shop_id: shopId,
        product_id: productId,
        discount_pct: discountPct,
        starts_at: startsAt,
        ends_at: endsAt
    });
};

export const getActiveFlashSale = async (productId: number) => {
    const now = new Date();

    return await FlashSale.findOne({
        where: {
            product_id: productId,
            is_active: true,
            starts_at: { [Op.lte]: now },   // sale already started (starts_at ≤ now)
            ends_at: { [Op.gte]: now }      // sale hasn't ended yet (now ≤ ends_at)
        }
    });
};




/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  SECURITY RULE — shop_id on EVERY operation:
    getProducts(shop_id)           → WHERE shop_id = ?
    getProductById(id, shop_id)    → WHERE id = ? AND shop_id = ?
    createProduct(shop_id, data)   → INSERT with shop_id from JWT
    updateProduct(id, shop_id)     → find first (checks shop_id) then update
    deleteProduct(id, shop_id)     → find first (checks shop_id) then delete

    shop_id ALWAYS comes from req.user.shop_id (JWT token)
    NEVER from req.body → can't be faked! 🔒

  FLOW — create product:
  ───────────────────────
  POST /api/products
        ↓
  product.controller reads req.user.shop_id + req.body
        ↓
  createProduct(shop_id, { name, price, stock })
        ↓
  Product.create({ shop_id: 1, name: "Olive Oil", price: 5000, stock: 100 })
        ↓
  new row saved in database ✅
        ↓
  controller sends { success: true, data: product } ✅

  FLOW — delete product (security):
  ───────────────────────────────────
  DELETE /api/products/3
  req.user.shop_id = 1 (Zaytoon Store owner)
        ↓
  deleteProduct(3, 1)
        ↓
  getProductById(3, 1)
  → WHERE id = 3 AND shop_id = 1
  → product 3 belongs to shop 2 → null returned
  → throw "Product not found" 🛑
  → Zaytoon owner can't delete Electronics product! 🔒

  REUSE PATTERN:
    updateProduct() and deleteProduct() both call getProductById() first
    → find + security check in ONE place
    → no duplicate code ✅
*/