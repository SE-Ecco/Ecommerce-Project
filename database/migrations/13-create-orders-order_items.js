'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE order_status AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    `);

    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'addresses', key: 'id' },
        onDelete: 'SET NULL',
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'coupons', key: 'id' },
        onDelete: 'SET NULL', //
      },
      status: {
        type: Sequelize.ENUM('pending','confirmed','processing','shipped','delivered','cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      variant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'product_variants', key: 'id' },
        onDelete: 'SET NULL',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,  // PRICE SNAPSHOT at purchase time 📸
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // add FK from coupon_usages.order_id now that orders exists
    await queryInterface.sequelize.query(`
      ALTER TABLE coupon_usages
      ADD CONSTRAINT fk_coupon_usages_order
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    `);

    await queryInterface.addIndex('orders', ['tenant_id'], { name: 'idx_orders_tenant_id' });
    await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_orders_user_id' });
    await queryInterface.addIndex('orders', ['status'], { name: 'idx_orders_status' });
    await queryInterface.addIndex('order_items', ['order_id'], { name: 'idx_order_items_order_id' });
    await queryInterface.addIndex('order_items', ['product_id'], { name: 'idx_order_items_product_id' });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON orders
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON orders`);
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS order_status`);
  },
};