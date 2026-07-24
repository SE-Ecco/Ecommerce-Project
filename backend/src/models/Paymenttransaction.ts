// WHAT: Sequelize model for "payment_transactions" table — tracks every payment attempt
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/payment.service.ts
// COLUMNS:
//   id              → SERIAL, Primary Key
//   order_id        → INTEGER, FK → orders.id
//   tenant_id       → INTEGER, FK → tenants.id
//   amount          → DECIMAL(10,2), how much was charged
//   status          → ENUM('pending','completed','failed','refunded')
//   payment_method  → VARCHAR, how customer paid
//   transaction_ref → VARCHAR, UNIQUE, receipt from payment gateway
//   created_at      → TIMESTAMP
//   updated_at      → TIMESTAMP
// NOTE: one order can have MULTIPLE payment attempts (first try failed, retry succeeded)

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// PaymentTransaction class = blueprint of the payment_transactions table
// each instance = one payment attempt for one order
class PaymentTransaction extends Model {
  declare id: number;
  declare order_id: number;              // which order this payment is for
  declare tenant_id: number;             // which shop received this payment
  declare amount: number;                // how much was charged in this attempt
  declare status: 'pending' | 'completed' | 'failed' | 'refunded';
  declare payment_method: string | null; // how customer paid:
                                         // "cash_on_delivery" → most common in Duhok! 🇮🇶
                                         // "card", "fastpay", "zaincash"
  declare transaction_ref: string | null; // unique receipt from payment gateway
                                          // needed to track/refund payments
                                          // NULL for cash on delivery (no gateway)
}

PaymentTransaction.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_ref: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,              // each successful payment has unique reference
    },
  },
  {
    sequelize,
    modelName: 'PaymentTransaction',
    tableName: 'payment_transactions',
    timestamps: true,
    underscored: true,
  }
);

export default PaymentTransaction;