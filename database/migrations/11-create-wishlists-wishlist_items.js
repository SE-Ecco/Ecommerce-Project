'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wishlists', {
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
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'shops', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'My Wishlist',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('wishlist_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      wishlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wishlists', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // no duplicate product in same wishlist
    await queryInterface.sequelize.query(`
      ALTER TABLE wishlist_items
      ADD CONSTRAINT unique_wishlist_item UNIQUE (wishlist_id, product_id)
    `);

    await queryInterface.addIndex('wishlists', ['user_id'], { name: 'idx_wishlists_user_id' });
    await queryInterface.addIndex('wishlists', ['shop_id'], { name: 'idx_wishlists_shop_id' });
    await queryInterface.addIndex('wishlist_items', ['wishlist_id'], { name: 'idx_wishlist_items_wishlist_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wishlist_items');
    await queryInterface.dropTable('wishlists');
  },
};