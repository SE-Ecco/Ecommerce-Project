// WHAT: Sequelize model for "users" table — defines structure of ALL users in the system
// WHY:  Sequelize reads this blueprint → manages the actual PostgreSQL table
// USED BY: auth.service.ts (find/create users), models/index.ts (relations)
// CONNECTS TO: shops table via shop_id (foreign key)

/*
    Imagine a blueprint 📐 for building a house
        this house has:
        → 3 bedrooms
        → 2 bathrooms
        → 1 kitchen
        → each room has specific dimensions
    The blueprint is not the house itSelf 🏠, it's the description of the house, it tells the builder how to construct the house.
        this users table has:
        → id column
        → email column (unique)
        → password column
        → role column
        → shop_id column
        → each column has specific type + rules

*/

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import  sequelize  from '../config/database'; // our database connection instance

// class declaration — User blueprint extends Sequelize base Model
// declare = TypeScript only, tells TS what fields exist (no runtime effect)
class User extends Model {
  declare id: number;                                        // primary key
  declare shop_id: number | null;                           // null for super_admin + customers
  declare full_name: string;                                // user's full name
  declare email: string;                                    // unique login identifier
  declare password: string;                                 // bcrypt hash — never plain text!
  declare phone: string | null;                             // optional contact number
  declare role: 'super_admin' | 'shop_admin' | 'customer'; // controls access level
}

// User.init() = tell Sequelize the exact columns + rules for this table
User.init(
  {
    id: {
      type: DataTypes.INTEGER,  // whole number
      autoIncrement: true,      // database auto-generates: 1, 2, 3...
      primaryKey: true,         // unique identifier for each row
    },
    shop_id: {
      type: DataTypes.INTEGER,  // points to shops.id (foreign key)
      allowNull: true,          // NULL for super_admin and customers
    },
    full_name: {
      type: DataTypes.STRING,   // text value
      allowNull: false,         // required — cannot be empty
    },
    email: {
      type: DataTypes.STRING,   // text value
      allowNull: false,         // required — cannot be empty
      unique: true,             // no two users can have same email
    },
    password: {
      type: DataTypes.STRING,   // stores bcrypt hash (long scrambled string)
      allowNull: false,         // required — cannot be empty
    },
    phone: {
      type: DataTypes.STRING,   // text (phone numbers can have + and spaces)
      allowNull: true,          // optional — user may not provide it
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'shop_admin', 'customer'), // fixed choices only
      allowNull: false,         // required — every user must have a role
      defaultValue: 'customer', // new users always start as customer — nobody self-promotes!
    },
  },
  {
    sequelize,          // which database connection to use
    tableName: 'users', // exact PostgreSQL table name
    timestamps: true,   // auto adds created_at + updated_at columns
  }
);

export default User; // exported so auth.service.ts + models/index.ts can import it

/*
  HOW THIS FILE CONNECTS TO THE REST OF THE PROJECT:
  ────────────────────────────────────────────────────

  DATABASE:
    User.init() → Sequelize creates/manages "users" table in PostgreSQL
    shop_id → foreign key pointing to shops.id (defined in models/index.ts)

  AUTH FLOW:
    register → auth.service.ts calls User.create() → saves new row here
    login    → auth.service.ts calls User.findOne() → finds row by email
             → comparePassword() checks password against stored hash
             → jwt.ts generates token with { id, role, shop_id } from this model

  SECURITY:
    password  → NEVER stored plain, always bcrypt hash
    role      → always 'customer' by default, only super_admin can change it
    shop_id   → baked into JWT token → req.user.shop_id on every request
    email     → unique constraint → database rejects duplicate emails

  RELATIONS (defined in models/index.ts):
    User belongs to Shop   (via shop_id)
    User has many Orders   (one user can place many orders)
*/
