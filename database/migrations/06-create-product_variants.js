'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_variants', {
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
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,  // "Size L - Red"
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,  // stock keeping unit — unique product code
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,  // NULL = use parent product price
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,  // {"size": "L", "color": "red"}
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,  // soft delete: NULL = exists, timestamp = deleted
      },
    });

    await queryInterface.addIndex('product_variants', ['product_id'], {
      name: 'idx_product_variants_product_id',
    });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON product_variants
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON product_variants`);
    await queryInterface.dropTable('product_variants');
  },
};