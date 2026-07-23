// WHAT: Sequelize model for "product_views" table — tracks every product page visit
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/analytics.service.ts
// COLUMNS:
//   id         → SERIAL, Primary Key
//   product_id → INTEGER, FK → products.id
//   tenant_id  → INTEGER, FK → tenants.id
//   user_id    → INTEGER, FK → users.id (NULL = guest visitor!)
//   viewed_at  → TIMESTAMP, when the view happened

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ProductView extends Model {
  declare id: number;
  declare product_id: number;    // which product was viewed
  declare tenant_id: number;     // which shop it belongs to
  declare user_id: number | null; // NULL = guest (not logged in)
                                  // number = logged-in customer
  declare viewed_at: Date;        // exact time of the view
}

ProductView.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,           // NULL = guest view — we still count it!
    },
    viewed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'ProductView',
    tableName: 'product_views',
    timestamps: false,
    underscored: true,
  }
);

export default ProductView;