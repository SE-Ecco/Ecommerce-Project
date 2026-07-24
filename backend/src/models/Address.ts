// WHAT: Sequelize model for "addresses" table — saved delivery addresses per user
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/address.service.ts
// COLUMNS:
//   id         → SERIAL, Primary Key
//   user_id    → INTEGER, FK → users.id
//   tenant_id  → INTEGER, FK → tenants.id
//   label      → VARCHAR, address nickname, default 'Home'
//   full_name  → VARCHAR, recipient name for this address
//   phone      → VARCHAR, recipient phone for delivery
//   city       → VARCHAR, city name
//   district   → VARCHAR, district/neighborhood (optional)
//   street     → TEXT, street address details
//   notes      → TEXT, delivery notes (optional, VERY useful for Duhok!)
//   is_default → BOOLEAN, default false (pre-selected at checkout)
//   created_at → TIMESTAMP
//   updated_at → TIMESTAMP

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// Address class = blueprint of the addresses table
// each instance = one saved delivery address for one user
class Address extends Model {
  declare id: number;
  declare user_id: number;        // which user this address belongs to
  declare tenant_id: number;      // which shop context (multi-tenant!)
  declare label: string;          // address nickname → "Home", "Work", "Mom's House"
  declare full_name: string;      // recipient name → "Khalil Ahmed"
  declare phone: string;          // recipient phone → "07501234567"
  declare city: string;           // city → "Duhok"
  declare district: string | null; // district/neighborhood → "Zakho Road"
  declare street: string;         // street details → "Building 5, Apartment 3"
  declare notes: string | null;   // delivery notes → "near the blue mosque, red door"
                                  // VERY important for Duhok local delivery! 🎯
  declare is_default: boolean;    // true = pre-selected at checkout (most used address)
}

Address.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Home',   // most common label
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,        // required — delivery needs recipient name
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,        // required — delivery person needs to call!
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,        // required — must know which city
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,         // optional — extra location detail
    },
    street: {
      type: DataTypes.TEXT,
      allowNull: false,        // required — specific address details
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,         // optional — landmark hints for delivery driver
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,     // user must explicitly set a default
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
  }
);

export default Address;

/*
  WHY notes FIELD IS IMPORTANT FOR DUHOK:
  ─────────────────────────────────────────────────────────────────
  many streets in Duhok don't have formal names or numbers
  delivery drivers need landmarks to find houses
  "near the blue mosque" or "opposite Besta supermarket"
  this is real-world practical design for the local market 🎯
*/