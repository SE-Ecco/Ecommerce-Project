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
// RULE 🚨: shop_id must ALWAYS come from JWT token — NEVER from req.body!
//          this is enforced in middleware, but every query here filters by shop_id
//
// HOW TO READ ASSOCIATIONS:
//   hasMany    → "I own many of these"      → shop.hasMany(Product) = one shop, many products
//   belongsTo  → "I belong to one of these" → Product.belongsTo(shop) = product belongs to shop
//   belongsToMany → "many-to-many via bridge table"
//
// TABLES IN THIS PROJECT (22 tables):
//   Core:        shops, users, categories, products
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

import shop           from './Shop';
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
// shop associations
// shops = the CENTER of everything in multi-shop system
// almost every table has shop_id pointing back here
// ─────────────────────────────────────────────────────────────
shop.hasOne(ShopSettings, {
  foreignKey: 'shop_id',
  as: 'settings',               // shop.findOne({ include: [{ model: ShopSettings, as: 'settings' }] })
});
shop.hasMany(User, {
  foreignKey: 'shop_id',
  as: 'users',
});
shop.hasMany(Category, {
  foreignKey: 'shop_id',
  as: 'categories',
});
shop.hasMany(Product, {
  foreignKey: 'shop_id',
  as: 'products',
});
shop.hasMany(Order, {
  foreignKey: 'shop_id',
  as: 'orders',
});
shop.hasMany(FlashSale, {
  foreignKey: 'shop_id',
  as: 'flash_sales',
});
shop.hasMany(ShippingMethod, {
  foreignKey: 'shop_id',
  as: 'shipping_methods',
});
shop.hasMany(Tag, {
  foreignKey: 'shop_id',
  as: 'tags',
});
shop.hasMany(SearchLog, {
  foreignKey: 'shop_id',
  as: 'search_logs',
});
shop.hasMany(Notification, {
  foreignKey: 'shop_id',
  as: 'notifications',
});
shop.hasMany(ProductReview, {
  foreignKey: 'shop_id',
  as: 'reviews',
});
shop.hasMany(ProductView, {
  foreignKey: 'shop_id',
  as: 'product_views',
});
shop.hasMany(CartItem, {
  foreignKey: 'shop_id',
  as: 'cart_items',
});
shop.hasMany(Wishlist, {
  foreignKey: 'shop_id',
  as: 'wishlists',
});
shop.hasMany(ProductVariant, {
  foreignKey: 'shop_id',
  as: 'product_variants',
});
shop.hasMany(Address, { foreignKey: 'shop_id', as: 'addresses' });

// ─────────────────────────────────────────────────────────────
// USER associations
// users can be customers, vendors, or admins
// admin users have shop_id = NULL (they belong to no shop)
// ─────────────────────────────────────────────────────────────
User.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Category.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Product.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
ProductVariant.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
ProductReview.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});

// ─────────────────────────────────────────────────────────────
// PRODUCT VIEW associations
// user_id is nullable → guest views also counted
// ─────────────────────────────────────────────────────────────
ProductView.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});
ProductView.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Tag.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
CartItem.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Wishlist.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Address.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
Order.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
PaymentTransaction.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});

// ─────────────────────────────────────────────────────────────
// FLASH SALE associations
// limited time discounts on specific products
// DB has CHECK: ends_at > starts_at + discount_pct between 1-100
// ─────────────────────────────────────────────────────────────
FlashSale.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});
FlashSale.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// ─────────────────────────────────────────────────────────────
// SHOP SETTINGS associations
// one-to-one: ONE settings row per shop (UNIQUE on shop_id in DB)
// ─────────────────────────────────────────────────────────────
ShopSettings.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});

// ─────────────────────────────────────────────────────────────
// SHIPPING METHOD associations
// each shop defines their own delivery options
// ─────────────────────────────────────────────────────────────
ShippingMethod.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});

// ─────────────────────────────────────────────────────────────
// NOTIFICATION associations
// system messages to users (order updates, flash sales, etc.)
// ─────────────────────────────────────────────────────────────
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});
Notification.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
});

// ─────────────────────────────────────────────────────────────
// SEARCH LOG associations
// tracks what customers search for (business intelligence!)
// user_id is nullable → guest searches also counted
// ─────────────────────────────────────────────────────────────
SearchLog.belongsTo(shop, {
  foreignKey: 'shop_id',
  as: 'shop',
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
  shop,
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