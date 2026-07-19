'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipping_methods', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,    // "Standard", "Express", "Free Delivery"
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,  // 0 = free shipping
      },
      min_days: {
        type: Sequelize.INTEGER,
        allowNull: true,     // estimated min delivery days
      },
      max_days: {
        type: Sequelize.INTEGER,
        allowNull: true,     // estimated max delivery days
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

    await queryInterface.addIndex('shipping_methods', ['tenant_id'], {
      name: 'idx_shipping_methods_tenant_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shipping_methods');
  },
};