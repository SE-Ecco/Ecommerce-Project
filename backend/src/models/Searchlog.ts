// WHAT: Sequelize model for "search_logs" table — tracks search queries per shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/search.service.ts
// COLUMNS:
//   id            → SERIAL, Primary Key
//   tenant_id     → INTEGER, FK → tenants.id
//   user_id       → INTEGER, FK → users.id (NULL for guest searches)
//   query         → VARCHAR(255), search string entered by user
//   results_count → INTEGER, number of matching products found
//   created_at    → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// SearchLog class = blueprint of the search_logs table
// each instance = one search action performed by a user or guest on a shop
class SearchLog extends Model {
  declare id: number;            // primary key — auto generated
  declare tenant_id: number;     // which shop this search happened in (multi-tenancy)
  declare user_id: number | null;// NULL = guest user | number = logged-in user ID
  declare query: string;         // search keyword → "olive oil", "shampoo"
  declare results_count: number; // 0 = no products found → indicates market demand! 💡
  declare created_at: Date;      // timestamp when the search was performed
}

// SearchLog.init() = tell Sequelize exact columns + rules for this table
SearchLog.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each search log
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
      allowNull: false,          // primary key cannot be null
    },
    tenant_id: {
      type: DataTypes.INTEGER,   // references tenants.id
      allowNull: false,          // required — multi-tenant isolation!
    },
    user_id: {
      type: DataTypes.INTEGER,   // references users.id
      allowNull: true,           // optional — NULL for guest searches
    },
    query: {
      type: DataTypes.STRING,// search term max length 255 chars
      allowNull: false,          // required — cannot log an empty search string
    },
    results_count: {
      type: DataTypes.INTEGER,   // whole number
      allowNull: false,          // required
      defaultValue: 0,           // 0 = no results found (helps shop owner know missing stock)
    },
  },
  {
    sequelize,           // which database connection to use
    modelName: 'SearchLog', // Sequelize internal model name
    tableName: 'search_logs', // exact PostgreSQL table name
    timestamps: false,   // search logs are insert-only, no updated_at needed
    underscored: true,   // converts camelCase to snake_case in DB
  }
);

export default SearchLog;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    SearchLog.init() → Sequelize manages "search_logs" table in PostgreSQL

  SERVICE:
    search.service.ts → SearchLog.create({ tenant_id, user_id, query, results_count })
    analytics.service.ts → SearchLog.findAll({ where: { tenant_id, results_count: 0 } }) 
                           → analytics for top searched / missing products!

  RELATIONS (defined in models/index.ts):
    SearchLog belongs to Tenant (via tenant_id)
    SearchLog belongs to User   (via user_id, optional)

  EXAMPLE:
  ─────────
  search_logs table in PostgreSQL:
  ┌────┬───────────┬─────────┬───────────────┬───────────────┐
  │ id │ tenant_id │ user_id │ query         │ results_count │
  ├────┼───────────┼─────────┼───────────────┼───────────────┤
  │ 1  │ 1         │ 5       │ olive oil     │ 12            │ ← logged-in user search
  │ 2  │ 1         │ NULL    │ organic soap  │ 0             │ ← guest search (0 results!) 💡
  └────┴───────────┴─────────┴───────────────┴───────────────┘
*/