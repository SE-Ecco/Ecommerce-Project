// WHAT: Sequelize model for "shipping_methods" table — delivery options per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/shipping.service.ts
// COLUMNS:
//   id        → SERIAL, Primary Key
//   shop_id → INTEGER, FK → shops.id
//   name      → VARCHAR, delivery option label
//   price     → DECIMAL(10,2), delivery cost (0 = free!)
//   min_days  → INTEGER, minimum estimated delivery days (nullable)
//   max_days  → INTEGER, maximum estimated delivery days (nullable)
//   is_active → BOOLEAN, default true
//   created_at → TIMESTAMP

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// ShippingMethod class = blueprint of the shipping_methods table
// each instance = one delivery option offered by one shop
class ShippingMethod extends Model {
  declare id: number;
  declare shop_id: number;        // which shop offers this shipping option
  declare name: string;             // option name → "Standard Delivery", "Express", "Free"
  declare price: number;            // cost in IQD → 2000.00 | 0.00 = free shipping!
  declare min_days: number | null;  // minimum days → 1 (best case)
  declare max_days: number | null;  // maximum days → 3 (worst case)
                                    // shown to customer as "1-3 business days"
  declare is_active: boolean;       // vendor can disable options temporarily
  declare created_at: Date;
}

ShippingMethod.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,           // 0 = free shipping
    },
    min_days: { type: DataTypes.INTEGER, allowNull: true },
    max_days: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
   
  },
  {
    sequelize,
    modelName: 'ShippingMethod',
    tableName: 'shipping_methods',
    timestamps: false,
    underscored: true,
  }
);

export default ShippingMethod;