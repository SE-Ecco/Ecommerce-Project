'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Array of tables in reverse dependency order for safe deletion
    const tables = [
      'search_logs', 'notifications', 'shipping_methods', 'shop_settings', 
      'flash_sales', 'payment_transactions', 'wishlist_items', 'wishlists', 
      'cart_items', 'product_tags', 'tags', 'product_views', 'product_reviews', 
      'product_images', 'order_items', 'orders', 'addresses', 'product_variants', 
      'products', 'categories', 'users', 'shops'
    ];
    
    // Clear existing data to prevent primary key / unique constraint conflicts
    for (const table of tables) { 
      await queryInterface.bulkDelete(table, null, {}); 
    }

    // 1. Insert Shop / Tenant
    await queryInterface.bulkInsert('shops', [{ 
      id: 500, 
      name: 'Zakho Electronics', 
      slug: 'zakho-tech', 
      email: 'info@zakho.com', 
      phone: '07500000000', 
      status: 'active', 
      created_at: new Date(), 
      updated_at: new Date() 
    }], {});
    
    // 2. Insert Users (Super Admin & Customer)
    await queryInterface.bulkInsert('users', [
      { id: 500, shop_id: 500, name: 'Ahmed', email: 'ahmed@mail.com', password_hash: 'hash', phone: '07500000000', role: 'super_admin', is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 501, shop_id: 500, name: 'Reekan', email: 'reekan@mail.com', password_hash: 'hash', phone: '07501111111', role: 'customer', is_active: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 3. Insert Product Categories
    await queryInterface.bulkInsert('categories', [{ id: 500, shop_id: 500, name: 'Mobiles', slug: 'mobiles', created_at: new Date(), updated_at: new Date() }], {});
    
    // 4. Insert Products
    await queryInterface.bulkInsert('products', [{ id: 500, shop_id: 500, category_id: 500, name: 'iPhone 15 Pro', price: 1500000, stock: 10, created_at: new Date(), updated_at: new Date() }], {});
    
    // 5. Insert Product Variants
    await queryInterface.bulkInsert('product_variants', [{ id: 500, product_id: 500, name: 'Natural Titanium', sku: 'IPHONE15-500', price: 1500000, stock: 5, created_at: new Date(), updated_at: new Date() }], {});
    
    // 6. Insert Customer Shipping Addresses
    await queryInterface.bulkInsert('addresses', [{ id: 500, user_id: 501, shop_id: 500, label: 'Home', full_name: 'Reekan', city: 'Duhok', street: 'Main Street', phone: '07501111111', created_at: new Date(), updated_at: new Date() }], {});
    
    // 7. Insert Customer Orders (Cleaned of coupon references)
    await queryInterface.bulkInsert('orders', [{ id: 500, shop_id: 500, user_id: 501, status: 'pending', total_amount: 1500000, created_at: new Date(), updated_at: new Date() }], {});
    
    // 8. Insert Order Items (Cleaned of coupon references)
    await queryInterface.bulkInsert('order_items', [{ id: 500, order_id: 500, product_id: 500, quantity: 1, unit_price: 1500000, created_at: new Date() }], {});
    
    // 9. Insert Product Gallery Images
    await queryInterface.bulkInsert('product_images', [{ id: 500, product_id: 500, cloudinary_url: 'url', cloudinary_public_id: 'img500', cloudinary_format: 'jpg', cloudinary_width: 800, cloudinary_height: 800, is_primary: true, sort_order: 1, created_at: new Date() }], {});
    
    // 10. Insert Product Reviews
    await queryInterface.bulkInsert('product_reviews', [{ id: 500, shop_id: 500, product_id: 500, user_id: 501, rating: 5, created_at: new Date(), updated_at: new Date() }], {});
    
    // 11. Insert Product Analytics / Views
    await queryInterface.bulkInsert('product_views', [{ id: 500, product_id: 500, shop_id: 500, user_id: 501, viewed_at: new Date() }], {});
    
    // 12. Insert Tags & Product Tag Mappings
    await queryInterface.bulkInsert('tags', [{ id: 500, shop_id: 500, name: 'Apple', created_at: new Date() }], {});
    await queryInterface.bulkInsert('product_tags', [{ id: 500, product_id: 500, tag_id: 500 }], {});
    
    // 13. Insert Active Cart Items
    await queryInterface.bulkInsert('cart_items', [{ id: 500, shop_id: 500, user_id: 501, product_id: 500, quantity: 1, created_at: new Date(), updated_at: new Date() }], {});
    
    // 14. Insert Wishlists & Wishlist Items
    await queryInterface.bulkInsert('wishlists', [{ id: 500, shop_id: 500, user_id: 501, name: 'Favorites', created_at: new Date() }], {});
    await queryInterface.bulkInsert('wishlist_items', [{ id: 500, wishlist_id: 500, product_id: 500, created_at: new Date() }], {});
    
    // 15. Insert Payment Transactions
    await queryInterface.bulkInsert('payment_transactions', [{ id: 500, shop_id: 500, order_id: 500, amount: 1500000, status: 'pending', created_at: new Date(), updated_at: new Date() }], {});
    
    // 16. Insert Flash Sale Promotions
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    await queryInterface.bulkInsert('flash_sales', [{ id: 500, shop_id: 500, product_id: 500, discount_pct: 15, starts_at: new Date(), ends_at: endDate, created_at: new Date() }], {});
    
    // 17. Insert Shop Settings & Configurations
    await queryInterface.bulkInsert('shop_settings', [{ id: 500, shop_id: 500, currency: 'IQD', created_at: new Date(), updated_at: new Date() }], {});
    
    // 18. Insert Shipping Options
    await queryInterface.bulkInsert('shipping_methods', [{ id: 500, shop_id: 500, name: 'Express', price: 5000, created_at: new Date() }], {});
    
    // 19. Insert User Notifications
    await queryInterface.bulkInsert('notifications', [{ 
      id: 500, 
      shop_id: 500, 
      user_id: 501, 
      type: 'info', 
      title: 'Update', 
      body: 'Your order has been processed.', 
      is_read: false, 
      created_at: new Date() 
    }], {});
    
    // 20. Insert Search Log Analytics
    await queryInterface.bulkInsert('search_logs', [{ id: 500, shop_id: 500, user_id: 501, query: 'iPhone', created_at: new Date() }], {});
  },

  async down(queryInterface, Sequelize) {
    // Teardown execution in exact reverse order
    const tables = [
      'search_logs', 'notifications', 'shipping_methods', 'shop_settings', 
      'flash_sales', 'payment_transactions', 'wishlist_items', 'wishlists', 
      'cart_items', 'product_tags', 'tags', 'product_views', 'product_reviews', 
      'product_images', 'order_items', 'orders', 'addresses', 'product_variants', 
      'products', 'categories', 'users', 'shops'
    ];
    for (const table of tables) { 
      await queryInterface.bulkDelete(table, null, {}); 
    }
  }
};