'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
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
      label: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Home',   // "Home", "Work", "Mom's House"
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      street: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,   // "near the blue mosque, red door" (important for Duhok!)
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,   // pre-selected at checkout
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

    await queryInterface.addIndex('addresses', ['user_id'], { name: 'idx_addresses_user_id' });
    await queryInterface.addIndex('addresses', ['tenant_id'], { name: 'idx_addresses_tenant_id' });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON addresses
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON addresses`);
    await queryInterface.dropTable('addresses');
  },
};