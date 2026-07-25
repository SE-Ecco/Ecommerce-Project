'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shop_settings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,   // ONE settings row per shop (one-to-one!)
        references: { model: 'shops', key: 'id' },
        onDelete: 'CASCADE',
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'IQD',   // Iraqi Dinar — default for Duhok market 🇮🇶
      },
      language: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'ar',    // Arabic default
      },
      theme_color: {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: '#3B82F6',   // hex color code
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      meta_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      extra: {
        type: Sequelize.JSONB,
        allowNull: true,   // future settings without new migrations!
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

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON shop_settings
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON shop_settings`);
    await queryInterface.dropTable('shop_settings');
  },
};