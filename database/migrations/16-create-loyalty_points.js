'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loyalty_points', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onDelete: 'CASCADE',
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'orders', key: 'id' },
        onDelete: 'SET NULL',
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,   // positive = earned, negative = spent
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,   // "Earned from order #123"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('loyalty_points', ['user_id'], { name: 'idx_loyalty_user_id' });
    await queryInterface.addIndex('loyalty_points', ['tenant_id'], { name: 'idx_loyalty_tenant_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loyalty_points');
  },
};