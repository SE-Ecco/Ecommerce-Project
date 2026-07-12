'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
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
      // Full Cloudinary metadata — needed for display + deletion + optimization
      cloudinary_url: {
        type: Sequelize.TEXT,
        allowNull: false,  // the secure_url from Cloudinary response
      },
      cloudinary_public_id: {
        type: Sequelize.STRING(255),
        allowNull: false,  // CRITICAL: needed to delete image from Cloudinary!
        unique: true,
      },
      cloudinary_format: {
        type: Sequelize.STRING(10),
        allowNull: true,  // jpg, png, webp
      },
      cloudinary_width: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cloudinary_height: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,  // main image shown in listings
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,  // control display order in gallery
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('product_images', ['product_id'], {
      name: 'idx_product_images_product_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_images');
  },
};