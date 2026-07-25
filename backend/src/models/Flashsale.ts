// WHAT: Sequelize model for "flash_sales" table — limited time discounts on products
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/flashsale.service.ts
// COLUMNS:
//   id           → SERIAL, Primary Key
//   shop_id    → INTEGER, FK → shops.id
//   product_id   → INTEGER, FK → products.id
//   discount_pct → INTEGER, discount percentage (1-100)
//   starts_at    → TIMESTAMP, when sale begins
//   ends_at      → TIMESTAMP, when sale ends (must be > starts_at)
//   is_active    → BOOLEAN, default true
//   created_at   → TIMESTAMP
// CONSTRAINT: ends_at > starts_at (in DB)
// CONSTRAINT: discount_pct between 1 and 100 (in DB)

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// FlashSale class = blueprint of the flash_sales table
// each instance = one time-limited discount on one product
class FlashSale extends Model {
  declare id: number;
  declare shop_id: number;    // which shop created this flash sale
  declare product_id: number;   // which product is on sale
  declare discount_pct: number; // percentage discount → 20 means 20% off
  declare starts_at: Date;      // when sale starts → "2026-07-04 10:00:00"
  declare ends_at: Date;        // when sale ends → "2026-07-04 12:00:00"
                                // creates urgency! "2 hours only!" ⚡
  declare is_active: boolean;   // vendor can manually deactivate early
  declare created_at: Date;
}

FlashSale.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    discount_pct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 100 }, // Sequelize-level validation (DB also has CHECK)
    },
    starts_at: { type: DataTypes.DATE, allowNull: false },
    ends_at: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: 'FlashSale',
    tableName: 'flash_sales',
    timestamps: false,
    underscored: true,
  }
);

export default FlashSale;