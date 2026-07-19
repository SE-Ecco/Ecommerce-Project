// WHAT: Creates "categories" table — references shops (run after 01)
// COLUMNS: id, shop_id (FK→shops), name, created_at

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
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
        allowNull: false,
      },
       slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // NULL = top level category
        references: { model: 'categories', key: 'id' },
        onDelete: 'SET NULL',
      },
      // Cloudinary banner image for category page
      cloudinary_banner_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cloudinary_banner_public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
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

    await queryInterface.addIndex('categories', ['tenant_id'], { name: 'idx_categories_tenant_id' });
    await queryInterface.addIndex('categories', ['parent_id'], { name: 'idx_categories_parent_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};