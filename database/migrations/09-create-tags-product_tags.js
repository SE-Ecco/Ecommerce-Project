'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // no duplicate tag names per shop
    await queryInterface.sequelize.query(`
      ALTER TABLE tags ADD CONSTRAINT unique_tag_per_tenant UNIQUE (tenant_id, name)
    `);

    await queryInterface.createTable('product_tags', {
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
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    // no duplicate tag on same product
    await queryInterface.sequelize.query(`
      ALTER TABLE product_tags ADD CONSTRAINT unique_product_tag UNIQUE (product_id, tag_id)
    `);

    await queryInterface.addIndex('tags', ['tenant_id'], { name: 'idx_tags_tenant_id' });
    await queryInterface.addIndex('product_tags', ['product_id'], { name: 'idx_product_tags_product_id' });
    await queryInterface.addIndex('product_tags', ['tag_id'], { name: 'idx_product_tags_tag_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_tags');
    await queryInterface.dropTable('tags');
  },
};