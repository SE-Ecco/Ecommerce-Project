// WHAT: Registers ALL model relationships (foreign keys, associations)
// IMPORTS: Shop, User, Category, Product, Order, OrderItem models
// USED BY: config/database.ts (imported once at startup)
// RELATIONS:
//   Shop      hasMany → Users      (shop_id)
//   Shop      hasMany → Categories (shop_id)
//   Shop      hasMany → Products   (shop_id)
//   Shop      hasMany → Orders     (shop_id)
//   Shop      hasMany → OrderItems (shop_id)
//   User      hasMany → Orders     (user_id)
//   Category  hasMany → Products   (category_id)
//   Order     hasMany → OrderItems (order_id)
//   Order     belongsTo → User     (user_id)
//   Order     belongsTo → Shop     (shop_id)
//   OrderItem belongsTo → Order    (order_id)
//   OrderItem belongsTo → Product  (product_id)
//   Product   belongsTo → Category (category_id)
//   Product   belongsTo → Shop     (shop_id)


// WHAT: Central hub — imports ALL models + defines ALL associations between them
// IMPORTS: all model files
// USED BY: config/database.ts (loaded at server startup)
//
// RULE 🚨: tenant_id must ALWAYS come from JWT token — NEVER from req.body!
//          this is enforced in middleware, but every query here filters by tenant_id
//
// HOW TO READ ASSOCIATIONS:
//   hasMany    → "I own many of these"      → Tenant.hasMany(Product) = one shop, many products
//   belongsTo  → "I belong to one of these" → Product.belongsTo(Tenant) = product belongs to shop
//   belongsToMany → "many-to-many via bridge table"
//
// TABLES IN THIS PROJECT (22 tables):
//   Core:        tenants, users, categories, products
//   Product:     product_images, product_variants, product_reviews, product_views, tags, product_tags
//   Shopping:    cart_items, wishlists, wishlist_items, addresses
//   Orders:      orders, order_items, payment_transactions
//   Flash:       flash_sales
//   Shop Mgmt:   shop_settings, shipping_methods
//   Comm:        notifications
//   Analytics:   search_logs (created by team member)
//
// REMOVED TABLES (not in this project):
//   ❌ coupons, coupon_usages, loyalty_points → removed from project scope

import Tenant           from './Shop';
import User             from './User';
import Category         from './Category';
import Product          from './Product';
import ProductImage     from './Productimage';
import ProductVariant   from './Productvariant';
import ProductReview    from './Productreview';
import ProductView      from './Productview';
import {Tag,ProductTag} from './Tag-ProductTag';
import CartItem         from './Cartitem';
import {Wishlist,WishlistItem} from './Wishlist-WishlistItem';
import Address          from './Address';
import {Order,OrderItem} from './Order-OrderItem';
import PaymentTransaction from './Paymenttransaction';
import FlashSale        from './Flashsale';
import ShopSettings     from './Shopsettings';
import ShippingMethod   from './Shippingmethod ';
import Notification     from './Notification';
import SearchLog        from './Searchlog'; // created by team member ✅

// ─────────────────────────────────────────────────────────────
// TENANT associations
// tenants = the CENTER of everything in multi-tenant system
// almost every table has tenant_id pointing back here
// ─────────────────────────────────────────────────────────────
Tenant.hasOne(ShopSettings, {
  foreignKey: 'tenant_id',
  as: 'settings',               // Tenant.findOne({ include: [{ model: ShopSettings, as: 'settings' }] })
});
Tenant.hasMany(User, {
  foreignKey: 'tenant_id',
  as: 'users',
});
Tenant.hasMany(Category, {
  foreignKey: 'tenant_id',
  as: 'categories',
});
Tenant.hasMany(Product, {
  foreignKey: 'tenant_id',
  as: 'products',
});
Tenant.hasMany(Order, {
  foreignKey: 'tenant_id',
  as: 'orders',
});
Tenant.hasMany(FlashSale, {
  foreignKey: 'tenant_id',
  as: 'flash_sales',
});
Tenant.hasMany(ShippingMethod, {
  foreignKey: 'tenant_id',
  as: 'shipping_methods',
});
Tenant.hasMany(Tag, {
  foreignKey: 'tenant_id',
  as: 'tags',
});
Tenant.hasMany(SearchLog, {
  foreignKey: 'tenant_id',
  as: 'search_logs',
});
Tenant.hasMany(Notification, {
  foreignKey: 'tenant_id',
  as: 'notifications',
});
Tenant.hasMany(ProductReview, {
  foreignKey: 'tenant_id',
  as: 'reviews',
});
Tenant.hasMany(ProductView, {
  foreignKey: 'tenant_id',
  as: 'product_views',
});
Tenant.hasMany(CartItem, {
  foreignKey: 'tenant_id',
  as: 'cart_items',
});
Tenant.hasMany(Wishlist, {
  foreignKey: 'tenant_id',
  as: 'wishlists',
});

// ─────────────────────────────────────────────────────────────
// USER associations
// users can be customers, vendors, or admins
// admin users have tenant_id = NULL (they belong to no shop)
// ─────────────────────────────────────────────────────────────
User.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
});
User.hasMany(Address, {
  foreignKey: 'user_id',
  as: 'addresses',
});
User.hasMany(CartItem, {
  foreignKey: 'user_id',
  as: 'cart_items',
});
User.hasMany(Wishlist, {
  foreignKey: 'user_id',
  as: 'wishlists',
});
User.hasMany(ProductReview, {
  foreignKey: 'user_id',
  as: 'reviews',
});
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications',
});
User.hasMany(ProductView, {
  foreignKey: 'user_id',
  as: 'product_views',            // user_id is nullable on product_views → guests counted too
});
User.hasMany(SearchLog, {
  foreignKey: 'user_id',
  as: 'search_logs',              // user_id is nullable on search_logs → guests counted too
});

// ─────────────────────────────────────────────────────────────
// CATEGORY associations
// categories are hierarchical — a category can have subcategories
// parent_id = NULL means top-level category
// parent_id = 3 means this is a subcategory of category 3
// ─────────────────────────────────────────────────────────────
Category.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});
Category.hasMany(Category, {
  foreignKey: 'parent_id',
  as: 'subcategories',            // Category.findAll({ include: [{ model: Category, as: 'subcategories' }] })
});
Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  as: 'parent',                   // Category.findOne({ include: [{ model: Category, as: 'parent' }] })
});

// ─────────────────────────────────────────────────────────────
// PRODUCT associations
// products are the core entity customers browse and buy
// no image_url on products → images live in product_images (1NF!)
// ─────────────────────────────────────────────────────────────
Product.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});
Product.hasMany(ProductImage, {
  foreignKey: 'product_id',
  as: 'images',                   // Product.findAll({ include: [{ model: ProductImage, as: 'images' }] })
});
Product.hasMany(ProductVariant, {
  foreignKey: 'product_id',
  as: 'variants',
});
Product.hasMany(ProductReview, {
  foreignKey: 'product_id',
  as: 'reviews',
});
Product.hasMany(ProductView, {
  foreignKey: 'product_id',
  as: 'views',
});
Product.hasMany(FlashSale, {
  foreignKey: 'product_id',
  as: 'flash_sales',
});
Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'cart_items',
});
Product.hasMany(WishlistItem, {
  foreignKey: 'product_id',
  as: 'wishlist_items',
});
Product.belongsToMany(Tag, {
  through: ProductTag,            // bridge table
  foreignKey: 'product_id',
  as: 'tags',                     // Product.findAll({ include: [{ model: Tag, as: 'tags' }] })
});
Product.belongsToMany(Order, {
  through: OrderItem,             // bridge table
  foreignKey: 'product_id',
  as: 'orders',
});

// ─────────────────────────────────────────────────────────────
// PRODUCT IMAGE associations
// each product can have many images (gallery!)
// cloudinary_public_id is needed to delete images from Cloudinary
// ─────────────────────────────────────────────────────────────
ProductImage.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ─────────────────────────────────────────────────────────────
// PRODUCT VARIANT associations
// variants = size/color/weight variations of the same product
// each variant has its own stock + optional price override
// ─────────────────────────────────────────────────────────────
ProductVariant.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
ProductVariant.hasMany(CartItem, {
  foreignKey: 'variant_id',
  as: 'cart_items',
});
ProductVariant.hasMany(OrderItem, {
  foreignKey: 'variant_id',
  as: 'order_items',
});

// ─────────────────────────────────────────────────────────────
// PRODUCT REVIEW associations
// one review per customer per product (UNIQUE constraint in DB)
// rating validated 1-5 in both Sequelize and DB CHECK constraint
// ─────────────────────────────────────────────────────────────
ProductReview.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
ProductReview.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
ProductReview.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});

// ─────────────────────────────────────────────────────────────
// PRODUCT VIEW associations
// user_id is nullable → guest views also counted
// ─────────────────────────────────────────────────────────────
ProductView.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
ProductView.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
ProductView.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// ─────────────────────────────────────────────────────────────
// TAG associations
// tags are searchable labels per shop
// product ↔ tags = many-to-many via product_tags bridge table
// ─────────────────────────────────────────────────────────────
Tag.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Tag.belongsToMany(Product, {
  through: ProductTag,            // bridge table
  foreignKey: 'tag_id',
  as: 'products',
});

// ─────────────────────────────────────────────────────────────
// CART ITEM associations
// persistent cart for logged-in users (cross-device!)
// guest cart lives in browser (Zustand) — no DB needed for guests
// ─────────────────────────────────────────────────────────────
CartItem.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
CartItem.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
CartItem.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant',
});

// ─────────────────────────────────────────────────────────────
// WISHLIST associations
// user can have multiple named wishlists
// "Birthday gifts", "Electronics I want", "My Wishlist"
// ─────────────────────────────────────────────────────────────
Wishlist.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
Wishlist.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Wishlist.hasMany(WishlistItem, {
  foreignKey: 'wishlist_id',
  as: 'items',                    // Wishlist.findAll({ include: [{ model: WishlistItem, as: 'items' }] })
});

// ─────────────────────────────────────────────────────────────
// WISHLIST ITEM associations
// each row = one product saved in one wishlist
// UNIQUE(wishlist_id, product_id) → no duplicates (enforced in DB)
// ─────────────────────────────────────────────────────────────
WishlistItem.belongsTo(Wishlist, {
  foreignKey: 'wishlist_id',
  as: 'wishlist',
});
WishlistItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ─────────────────────────────────────────────────────────────
// ADDRESS associations
// customers save multiple delivery addresses
// "Home", "Work", "Mom's House"
// is_default = pre-selected at checkout
// ─────────────────────────────────────────────────────────────
Address.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
Address.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Address.hasMany(Order, {
  foreignKey: 'address_id',
  as: 'orders',
});

// ─────────────────────────────────────────────────────────────
// ORDER associations
// orders = customer purchases
// unit_price in order_items = price SNAPSHOT at purchase time 📸
// never reference products.price for order history!
// ─────────────────────────────────────────────────────────────
Order.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
Order.belongsTo(Address, {
  foreignKey: 'address_id',
  as: 'address',
});
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',                    // Order.findAll({ include: [{ model: OrderItem, as: 'items' }] })
});
Order.hasMany(PaymentTransaction, {
  foreignKey: 'order_id',
  as: 'payments',
});
Order.belongsToMany(Product, {
  through: OrderItem,             // bridge table
  foreignKey: 'order_id',
  as: 'products',
});

// ─────────────────────────────────────────────────────────────
// ORDER ITEM associations
// each row = one product line in one order
// unit_price MUST be snapshot — never live product price!
// ─────────────────────────────────────────────────────────────
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
OrderItem.belongsTo(ProductVariant, {
  foreignKey: 'variant_id',
  as: 'variant',
});

// ─────────────────────────────────────────────────────────────
// PAYMENT TRANSACTION associations
// one order can have multiple payment attempts
// (first attempt failed → customer retries → second attempt succeeds)
// ─────────────────────────────────────────────────────────────
PaymentTransaction.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});
PaymentTransaction.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});

// ─────────────────────────────────────────────────────────────
// FLASH SALE associations
// limited time discounts on specific products
// DB has CHECK: ends_at > starts_at + discount_pct between 1-100
// ─────────────────────────────────────────────────────────────
FlashSale.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
FlashSale.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ─────────────────────────────────────────────────────────────
// SHOP SETTINGS associations
// one-to-one: ONE settings row per shop (UNIQUE on tenant_id in DB)
// ─────────────────────────────────────────────────────────────
ShopSettings.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});

// ─────────────────────────────────────────────────────────────
// SHIPPING METHOD associations
// each shop defines their own delivery options
// ─────────────────────────────────────────────────────────────
ShippingMethod.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});

// ─────────────────────────────────────────────────────────────
// NOTIFICATION associations
// system messages to users (order updates, flash sales, etc.)
// ─────────────────────────────────────────────────────────────
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
Notification.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});

// ─────────────────────────────────────────────────────────────
// SEARCH LOG associations
// tracks what customers search for (business intelligence!)
// user_id is nullable → guest searches also counted
// ─────────────────────────────────────────────────────────────
SearchLog.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant',
});
SearchLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// ─────────────────────────────────────────────────────────────
// EXPORT ALL MODELS
// import like this in services:
// import { Product, ProductImage, Order, OrderItem } from '../models';
// ─────────────────────────────────────────────────────────────
export {
  Tenant,
  User,
  Category,
  Product,
  ProductImage,
  ProductVariant,
  ProductReview,
  ProductView,
  Tag,
  ProductTag,
  CartItem,
  Wishlist,
  WishlistItem,
  Address,
  Order,
  OrderItem,
  PaymentTransaction,
  FlashSale,
  ShopSettings,
  ShippingMethod,
  Notification,
  SearchLog,
};