// WHAT: Sequelize model for "search_logs" table — tracks every search made in a shop
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/search.service.ts
// COLUMNS:
//   id            → SERIAL, Primary Key
//   tenant_id     → INTEGER, FK → tenants.id
//   user_id       → INTEGER, FK → users.id (NULL = guest search!)
//   query         → VARCHAR, what the customer searched for
//   results_count → INTEGER, how many products matched the search
//   created_at    → TIMESTAMP
//
// WHY THIS TABLE EXISTS:
//   vendors can see what their customers search for
//   "olive oil" searched 500 times → vendor should stock more olive oil!
//   "laptop" searched 200 times but results_count = 0 → huge market opportunity!
//   this is real business intelligence data 💡

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// SearchLog class = blueprint of the search_logs table
// each instance = one search made by one user (or guest) inside one shop
class SearchLog extends Model {
  declare id: number;
  declare tenant_id: number;        // which shop was being searched
  declare user_id: number | null;   // who searched — NULL if guest (not logged in)
                                    // we still log guest searches for analytics!
  declare query: string;            // what they typed → "olive oil", "iphone", "laptop"
  declare results_count: number;    // how many products were returned
                                    // 0 = no results → vendor is missing this product!
                                    // this is the most valuable data point 🎯
  declare created_at: Date;         // when the search happened
}

// SearchLog.init() = tell Sequelize exact columns + rules for this table
SearchLog.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each search log
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    tenant_id: {
      type: DataTypes.INTEGER,   // whole number — references tenants.id
      allowNull: false,          // required — must know which shop was searched
    },
    user_id: {
      type: DataTypes.INTEGER,   // whole number — references users.id
      allowNull: true,           // NULL = guest search (not logged in)
                                 // we still want to count guest searches! 📊
    },
    query: {
      type: DataTypes.STRING,    // text value → "olive oil", "iphone 15"
      allowNull: false,          // required — must know what was searched
    },
    results_count: {
      type: DataTypes.INTEGER,   // whole number — how many products matched
      allowNull: false,          // required — 0 is a valid and important value!
      defaultValue: 0,           // default to 0 in case no results found
    },
  },
  {
    sequelize,                   // which database connection to use
    modelName: 'SearchLog',      // Sequelize internal model name
    tableName: 'search_logs',    // exact PostgreSQL table name
    timestamps: false,           // only created_at needed — logs never update
    underscored: true,           // converts camelCase to snake_case in DB
  }
);

export default SearchLog;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    SearchLog.init() → Sequelize manages "search_logs" table in PostgreSQL
    idx_search_logs_query → index on query column for fast analytics lookups
    idx_search_logs_tenant_id → index for filtering by shop

  SERVICE:
    search.service.ts → SearchLog.create({ tenant_id, user_id, query, results_count })
    search.service.ts → SearchLog.findAll({ where: { tenant_id, results_count: 0 } })
                        → shows vendor what products are MISSING from their shop!

  RELATIONS (defined in models/index.ts):
    SearchLog belongs to Tenant (via tenant_id)
    SearchLog belongs to User   (via user_id) ← nullable! guests have no user_id

  HOW TO USE IN SEARCH FLOW:
    customer types "iphone" → backend searches products →
    gets results → THEN logs the search:

    await SearchLog.create({
      tenant_id: req.user.tenant_id,  // from JWT — never from req.body!
      user_id: req.user?.id || null,  // null if guest
      query: 'iphone',
      results_count: products.length, // how many matched
    });

  ANALYTICS QUERIES VENDORS CAN RUN:
    top 10 most searched terms:
    SELECT query, COUNT(*) as searches
    FROM search_logs WHERE tenant_id = 1
    GROUP BY query ORDER BY searches DESC LIMIT 10;

    searches with zero results (missing products!):
    SELECT query, COUNT(*) as times
    FROM search_logs WHERE tenant_id = 1 AND results_count = 0
    GROUP BY query ORDER BY times DESC;

  EXAMPLE:
  ─────────
  search_logs table in PostgreSQL:
  ┌────┬───────────┬─────────┬──────────────┬───────────────┐
  │ id │ tenant_id │ user_id │ query        │ results_count │
  ├────┼───────────┼─────────┼──────────────┼───────────────┤
  │ 1  │ 1         │ 2       │ olive oil    │ 3             │ ← found results ✅
  │ 2  │ 1         │ NULL    │ fresh bread  │ 1             │ ← guest search ✅
  │ 3  │ 1         │ 5       │ laptop       │ 0             │ ← no results! 🚨 add laptops!
  │ 4  │ 3         │ 2       │ iphone 15    │ 2             │ ← found results ✅
  └────┴───────────┴─────────┴──────────────┴───────────────┘

  row 3 → "laptop" searched with 0 results
  → vendor of shop 1 should consider adding laptops to their inventory 💡
*/