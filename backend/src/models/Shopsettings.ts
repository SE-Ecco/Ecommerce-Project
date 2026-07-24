// WHAT: Sequelize model for "shop_settings" table — per-shop configuration
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/settings.service.ts
// COLUMNS:
//   id          → SERIAL, Primary Key
//   tenant_id   → INTEGER, FK → tenants.id, UNIQUE (one-to-one!)
//   currency    → VARCHAR, default 'IQD' (Iraqi Dinar for Duhok market!)
//   language    → VARCHAR, default 'ar' (Arabic default)
//   theme_color → VARCHAR, hex color code, default '#3B82F6'
//   meta_title  → VARCHAR, SEO title for shop page
//   meta_desc   → TEXT, SEO description for shop page
//   extra       → JSONB, future settings without new migrations!
//   created_at  → TIMESTAMP
//   updated_at  → TIMESTAMP
// NOTE: tenant_id is UNIQUE → one row per shop (one-to-one relationship!)

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

// ShopSettings class = blueprint of the shop_settings table
// each instance = configuration settings for ONE shop
// one shop → one settings row (one-to-one, enforced by UNIQUE on tenant_id)
class ShopSettings extends Model {
  declare id: number;
  declare tenant_id: number;        // which shop these settings belong to (UNIQUE!)
  declare currency: string;         // currency code → "IQD" (Iraqi Dinar for Duhok!) 🇮🇶
  declare language: string;         // language code → "ar" (Arabic), "ku" (Kurdish), "en"
  declare theme_color: string | null; // shop brand color → "#3B82F6" (blue)
  declare meta_title: string | null;  // SEO: page title shown in browser tab
  declare meta_desc: string | null;   // SEO: description shown in Google results
  declare extra: object | null;       // JSONB: any future settings!
                                      // {"whatsapp": "07501234567", "min_order": 5000}
                                      // add new settings without new migration files! 🎯
}

ShopSettings.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,              // ONE settings row per shop — enforced here AND in DB
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'IQD',      // Iraqi Dinar — right choice for Duhok market 🇮🇶
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ar',       // Arabic — most common language in Duhok
    },
    theme_color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#3B82F6',  // Tailwind blue-500 as default
    },
    meta_title: { type: DataTypes.STRING, allowNull: true },
    meta_desc: { type: DataTypes.TEXT, allowNull: true },
    extra: {
      type: DataTypes.JSONB,
      allowNull: true,          // flexible: store any future config here
    },
  },
  {
    sequelize,
    modelName: 'ShopSettings',
    tableName: 'shop_settings',
    timestamps: true,
    underscored: true,
  }
);

export default ShopSettings;