'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = ['search_logs', 'notifications', 'shipping_methods', 'shop_settings', 'flash_sales', 'loyalty_points', 'coupon_usages', 'payment_transactions', 'wishlist_items', 'wishlists', 'cart_items', 'product_tags', 'tags', 'product_views', 'product_reviews', 'product_images', 'order_items', 'orders', 'addresses', 'coupons', 'product_variants', 'products', 'categories', 'users', 'tenants'];
    for (const table of tables) { await queryInterface.bulkDelete(table, null, {}); }

    await queryInterface.bulkInsert('tenants', [{ id: 500, name: 'Zakho Electronics', slug: 'zakho-tech', email: 'info@zakho.com', phone: '07500000000', status: 'active', created_at: new Date(), updated_at: new Date() }], {});
    
    await queryInterface.bulkInsert('users', [
      { id: 500, tenant_id: 500, name: 'Ahmed', email: 'ahmed@mail.com', password_hash: 'hash', phone: '07500000000', role: 'super_admin', is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 501, tenant_id: 500, name: 'Reekan', email: 'reekan@mail.com', password_hash: 'hash', phone: '07501111111', role: 'customer', is_active: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    await queryInterface.bulkInsert('categories', [{ id: 500, tenant_id: 500, name: 'Mobiles', slug: 'mobiles', created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('products', [{ id: 500, tenant_id: 500, category_id: 500, name: 'iPhone 15 Pro', price: 1500000, stock: 10, created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('product_variants', [{ id: 500, product_id: 500, name: 'Natural Titanium', sku: 'IPHONE15-500', price: 1500000, stock: 5, created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('coupons', [{ id: 500, tenant_id: 500, code: 'SAVE10', discount_type: 'percentage', discount_value: 10, is_active: true, created_at: new Date() }], {});
    await queryInterface.bulkInsert('addresses', [{ id: 500, user_id: 501, tenant_id: 500, label: 'Home', full_name: 'Reekan', city: 'Duhok', street: 'Main Street', phone: '07501111111', created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('orders', [{ id: 500, tenant_id: 500, user_id: 501, status: 'pending', total_amount: 1500000, created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('order_items', [{ id: 500, order_id: 500, product_id: 500, quantity: 1, unit_price: 1500000, created_at: new Date() }], {});
    await queryInterface.bulkInsert('product_images', [{ id: 500, product_id: 500, cloudinary_url: 'url', cloudinary_public_id: 'img500', cloudinary_format: 'jpg', cloudinary_width: 800, cloudinary_height: 800, is_primary: true, sort_order: 1, created_at: new Date() }], {});
    await queryInterface.bulkInsert('product_reviews', [{ id: 500, tenant_id: 500, product_id: 500, user_id: 501, rating: 5, created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('product_views', [{ id: 500, product_id: 500, tenant_id: 500, user_id: 501, viewed_at: new Date() }], {});
    await queryInterface.bulkInsert('tags', [{ id: 500, tenant_id: 500, name: 'Apple', created_at: new Date() }], {});
    await queryInterface.bulkInsert('product_tags', [{ id: 500, product_id: 500, tag_id: 500 }], {});
    await queryInterface.bulkInsert('cart_items', [{ id: 500, tenant_id: 500, user_id: 501, product_id: 500, quantity: 1, created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('wishlists', [{ id: 500, tenant_id: 500, user_id: 501, name: 'Favorites', created_at: new Date() }], {});
    await queryInterface.bulkInsert('wishlist_items', [{ id: 500, wishlist_id: 500, product_id: 500, created_at: new Date() }], {});
    await queryInterface.bulkInsert('payment_transactions', [{ id: 500, tenant_id: 500, order_id: 500, amount: 1500000, status: 'pending', created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('coupon_usages', [{ id: 500, coupon_id: 500, user_id: 501, order_id: 500, used_at: new Date() }], {});
    await queryInterface.bulkInsert('loyalty_points', [{ id: 500, tenant_id: 500, user_id: 501, points: 150, created_at: new Date() }], {});
    
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    await queryInterface.bulkInsert('flash_sales', [{ id: 500, tenant_id: 500, product_id: 500, discount_pct: 15, starts_at: new Date(), ends_at: endDate, created_at: new Date() }], {});
    
    await queryInterface.bulkInsert('shop_settings', [{ id: 500, tenant_id: 500, currency: 'IQD', created_at: new Date(), updated_at: new Date() }], {});
    await queryInterface.bulkInsert('shipping_methods', [{ id: 500, tenant_id: 500, name: 'Express', price: 5000, created_at: new Date() }], {});
await queryInterface.bulkInsert('notifications', [{ 
      id: 500, 
      tenant_id: 500, 
      user_id: 501, 
      type: 'info', 
      title: 'Update', 
      body: 'Your order has been processed.', // تم إضافة نص الإشعار
      is_read: false, 
      created_at: new Date() 
    }], {});
     await queryInterface.bulkInsert('search_logs', [{ id: 500, tenant_id: 500, user_id: 501, query: 'iPhone', created_at: new Date() }], {});
  },

  async down(queryInterface, Sequelize) { }
};