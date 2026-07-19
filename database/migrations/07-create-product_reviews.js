'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_reviews', {
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
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,  // 1 to 5 stars (CHECK constraint below)
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      // Cloudinary photo — customer can attach a photo to their review
      cloudinary_photo_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cloudinary_photo_public_id: {
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

    // rating must be 1-5
    await queryInterface.sequelize.query(`
      ALTER TABLE product_reviews
      ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
    `);

    // one review per customer per product
    await queryInterface.sequelize.query(`
      ALTER TABLE product_reviews
      ADD CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
    `);

    await queryInterface.addIndex('product_reviews', ['product_id'], { name: 'idx_reviews_product_id' });
    await queryInterface.addIndex('product_reviews', ['tenant_id'], { name: 'idx_reviews_tenant_id' });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON product_reviews
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON product_reviews`);
    await queryInterface.dropTable('product_reviews');
  },
};