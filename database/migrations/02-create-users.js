// WHAT: Creates the "users" table — references shops (run after 01)
// COLUMNS: id, shop_id (FK→shops, nullable), full_name, email (unique), password, phone, role, created_at, updated_at
// ROLES: 'super_admin' | 'shop_admin' | 'customer'
// NOTE: shop_id is NULL for super_admin users (they manage all shops)

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE user_role AS ENUM ('customer', 'shop_admin', 'super_admin')`
    );

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // NULL for admin users (they belong to no shop)
        references: { model: 'tenants', key: 'id' },
        onDelete: 'CASCADE', // if we delete any shop  the users of this shop will be deleted
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.TEXT,
        allowNull: false,  // bcrypt hash only — NEVER store plain password!
      },
      phone:{
        type:Sequelize.STRING(20),
        allowNull:false,
      },
      role: {
        type: Sequelize.ENUM('customer', 'shop_admin', 'super_admin'),
        allowNull: false,
        defaultValue: 'customer',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      // Cloudinary avatar fields
      cloudinary_avatar_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cloudinary_avatar_public_id: {
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

    await queryInterface.addIndex('users', ['tenant_id'], { name: 'idx_users_tenant_id' });
    await queryInterface.addIndex('users', ['email'], { name: 'idx_users_email' });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON users`);
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS user_role`);
    
  },
};