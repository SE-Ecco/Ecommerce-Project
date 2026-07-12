'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE discount_type AS ENUM ('percentage', 'fixed')`
    );

    await queryInterface.createTable('coupons', {
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
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false,   // percentage = 10% off / fixed = 5000 IQD off
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      min_order_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      max_uses: {
        type: Sequelize.INTEGER,
        allowNull: true,   // NULL = unlimited uses
      },
      used_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,   // NULL = never expires
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // unique coupon code per shop
    await queryInterface.sequelize.query(`
      ALTER TABLE coupons ADD CONSTRAINT unique_coupon_per_tenant UNIQUE (tenant_id, code)
    `);

    await queryInterface.createTable('coupon_usages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'coupons', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // FK to orders added in orders migration (013 runs before 014)
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // one use per customer per coupon
    await queryInterface.sequelize.query(`
      ALTER TABLE coupon_usages
      ADD CONSTRAINT unique_coupon_usage UNIQUE (coupon_id, user_id)
    `);

    await queryInterface.addIndex('coupons', ['tenant_id'], { name: 'idx_coupons_tenant_id' });
    await queryInterface.addIndex('coupon_usages', ['coupon_id'], { name: 'idx_coupon_usages_coupon_id' });
    await queryInterface.addIndex('coupon_usages', ['user_id'], { name: 'idx_coupon_usages_user_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_usages');
    await queryInterface.dropTable('coupons');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS discount_type`);
  },
};