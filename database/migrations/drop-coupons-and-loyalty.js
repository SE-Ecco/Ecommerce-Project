'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1. Remove the 'coupon_id' column from the 'orders' table.
     * This will also remove the foreign key constraint.
     */
    await queryInterface.removeColumn('orders', 'coupon_id');
    /**
     * 2. Drop the redundant coupon and loyalty related tables.
     */
    await queryInterface.dropTable('coupon_usages');
    await queryInterface.dropTable('coupons');
    await queryInterface.dropTable('loyalty_points');

    /**
     * 3. Drop the custom ENUM type if it exists.
     */
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS discount_type');
  },

  async down(queryInterface, Sequelize) {
    // Logic to revert changes can be added here if needed.
  }
};