'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded')
    `);

    await queryInterface.createTable('payment_transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'shops', key: 'id' },
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_method: {
        type: Sequelize.STRING(100),
        allowNull: true,   // "cash_on_delivery", "card", "fastpay"
      },
      transaction_ref: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,      // receipt number from payment gateway
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

    await queryInterface.addIndex('payment_transactions', ['order_id'], { name: 'idx_payment_order_id' });
    await queryInterface.addIndex('payment_transactions', ['shop_id'], { name: 'idx_payment_shop_id' });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON payment_transactions
      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS set_timestamp ON payment_transactions`);
    await queryInterface.dropTable('payment_transactions');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS payment_status`);
  },
};