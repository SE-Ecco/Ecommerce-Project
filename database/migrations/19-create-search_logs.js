'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('search_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'shops', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,    // NULL = guest search (not logged in)
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      query: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      results_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,   // 0 = no products found = market opportunity!
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('search_logs', ['shop_id'], { name: 'idx_search_logs_shop_id' });
    await queryInterface.addIndex('search_logs', ['query'], { name: 'idx_search_logs_query' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('search_logs');
  },
};