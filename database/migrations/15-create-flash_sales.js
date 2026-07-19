'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flash_sales', {
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
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      discount_pct: {
        type: Sequelize.INTEGER,
        allowNull: false,   // 10, 20, 50 (percentage)
      },
      starts_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ends_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // ends_at must be after starts_at
    await queryInterface.sequelize.query(`
      ALTER TABLE flash_sales
      ADD CONSTRAINT valid_flash_dates CHECK (ends_at > starts_at)
    `);

    // discount must be 1-100
    await queryInterface.sequelize.query(`
      ALTER TABLE flash_sales
      ADD CONSTRAINT valid_flash_discount CHECK (discount_pct > 0 AND discount_pct <= 100)
    `);

    await queryInterface.addIndex('flash_sales', ['tenant_id'], { name: 'idx_flash_sales_tenant_id' });
    await queryInterface.addIndex('flash_sales', ['product_id'], { name: 'idx_flash_sales_product_id' });
    await queryInterface.addIndex('flash_sales', ['is_active', 'starts_at', 'ends_at'], {
      name: 'idx_flash_sales_active',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('flash_sales');
  },
};