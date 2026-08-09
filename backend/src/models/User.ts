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

// WHAT: Sequelize model for "users" table — one row = one user (customer, vendor, or admin)
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/auth.service.ts, services/user.service.ts
// COLUMNS:
//   id                           → SERIAL, Primary Key
//   shop_id                    → INTEGER, FK → shops.id (NULL for admin users!)
//   name                         → VARCHAR, user full name
//   email                        → VARCHAR, UNIQUE, login email
//   password_hash                → TEXT, bcrypt hashed password (NEVER plain text!)
//   role                         → ENUM('customer','vendor','admin'), default 'customer'
//   is_active                    → BOOLEAN, default true
//   cloudinary_avatar_url        → TEXT, Cloudinary profile picture URL
//   cloudinary_avatar_public_id  → VARCHAR, UNIQUE, for deleting avatar from Cloudinary
//   created_at                   → TIMESTAMP
//   updated_at                   → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// User class = blueprint of the users table
// each instance of User = one row = one person using the platform
class User extends Model {
  declare id: number;                              // primary key — auto generated
  declare shop_id: number | null;               // which shop this user belongs to
  declare phone: string | null;                                                 // NULL for admin users (they own the platform!)
  declare name: string;                            // full name → "Ahmed Ali"
  declare email: string;                           // login email → "ahmed@gmail.com"
  declare password_hash: string;                   // bcrypt hash → "$2b$10$..."
  // NEVER store plain password!
  declare role: 'customer' | 'shop_admin' | 'super_admin';  // what this user can do
  declare is_active: boolean;                      // false = account disabled
  declare cloudinary_avatar_url: string | null;    // profile picture URL from Cloudinary
  declare cloudinary_avatar_public_id: string | null; // needed to delete avatar from Cloudinary
}

// User.init() = tell Sequelize exact columns + rules for this table
User.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each user
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    shop_id: {
      type: DataTypes.INTEGER,   // whole number — references shops.id
      allowNull: true,           // NULL is allowed → admin users have no shop!
    },
    name: {
      type: DataTypes.STRING,    // text value → "Ahmed Ali"
      allowNull: false,          // required — every user must have a name
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // ← fix the DB constraint
    },
    email: {
      type: DataTypes.STRING,    // text value → "ahmed@gmail.com"
      allowNull: false,          // required — needed for login
      unique: true,              // no two users can share same email on the platform
    },
    password_hash: {
      type: DataTypes.TEXT,      // longer than STRING — bcrypt hashes are ~60 chars
      allowNull: false,          // required — every user must have password
    },
    role: {
      type: DataTypes.ENUM('customer', 'shop_admin', 'super_admin'), // only these 3 values allowed
      defaultValue: 'customer',  // new users are customers by default ✅
    },
    is_active: {
      type: DataTypes.BOOLEAN,   // true or false only
      defaultValue: true,        // new users are active by default ✅
    },
    cloudinary_avatar_url: {
      type: DataTypes.TEXT,      // full Cloudinary URL → "https://res.cloudinary.com/..."
      allowNull: true,           // optional — user may not upload avatar
    },
    cloudinary_avatar_public_id: {
      type: DataTypes.STRING,    // Cloudinary public_id → "duhok/avatars/user_123"
      allowNull: true,           // optional — only set when avatar uploaded
      unique: true,              // each uploaded image has unique public_id on Cloudinary
    },
  },
  {
    sequelize,           // which database connection to use
    modelName: 'User',   // Sequelize internal model name
    tableName: 'users',  // exact PostgreSQL table name
    timestamps: true,    // auto adds created_at + updated_at columns
    underscored: true,   // converts camelCase to snake_case in DB
  }
);

export default User;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    User.init() → Sequelize manages "users" table in PostgreSQL
    email unique → no duplicate accounts on platform
    shop_id nullable → admins don't belong to any shop

  SECURITY RULE 🚨:
    shop_id must ALWAYS come from the verified JWT token
    NEVER from req.body — hacker could fake it!
    backend middleware extracts shop_id from token → passes to service

  SERVICE:
    auth.service.ts → User.findOne({ where: { email } }) → login lookup
    auth.service.ts → User.create({ ... }) → register new user
    auth.service.ts → bcrypt.compare(password, user.password_hash) → verify password

  RELATIONS (defined in models/index.ts):
    User belongs to shop    (via shop_id)
    User has many Orders      (via user_id)
    User has many Addresses   (via user_id)
    User has many CartItems   (via user_id)
    User has many Wishlists   (via user_id)
    User has many Reviews     (via user_id)
    User has many Notifications (via user_id)

  ROLES EXPLAINED:
    customer → browses shops, adds to cart, places orders
    vendor   → owns a shop, manages products and orders
    admin    → super admin, manages entire platform

  EXAMPLE:
  ─────────
  users table in PostgreSQL:
  ┌────┬───────────┬────────────────┬───────────────────┬──────────┐
  │ id │ shop_id │ name           │ email             │ role     │
  ├────┼───────────┼────────────────┼───────────────────┼──────────┤
  │ 1  │ 1         │ Ahmed Ali      │ ahmed@gmail.com   │ vendor   │
  │ 2  │ 1         │ Khalil Test    │ khalil@gmail.com  │ customer │
  │ 3  │ NULL      │ Super Admin    │ admin@platform.com│ admin    │
  └────┴───────────┴────────────────┴───────────────────┴──────────┘

  User.findOne({ where: { email: "ahmed@gmail.com" } }) → returns row 1 ✅
  admin has shop_id = NULL → belongs to nobody → manages everyone ✅
*/ // exported so auth.service.ts + models/index.ts can import it

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
