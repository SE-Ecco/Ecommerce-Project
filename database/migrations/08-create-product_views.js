'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_views', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'shops', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // NULL = guest view (not logged in)
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('product_views', ['product_id'], { name: 'idx_product_views_product_id' });
    await queryInterface.addIndex('product_views', ['shop_id'], { name: 'idx_product_views_shop_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_views');
  },
};