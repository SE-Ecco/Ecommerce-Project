// WHAT: Sequelize model for "notifications" table — system messages sent to users
// IMPORTS: sequelize, config/database.ts
// USED BY: models/index.ts, services/notification.service.ts
// COLUMNS:
//   id         → SERIAL, Primary Key
//   user_id    → INTEGER, FK → users.id
//   shop_id  → INTEGER, FK → shops.id
//   type       → VARCHAR, notification category
//   title      → VARCHAR, short notification title
//   body       → TEXT, full notification message
//   is_read    → BOOLEAN, default false (unread by default)
//   data       → JSONB, extra context data (order_id, product_id, etc.)
//   created_at → TIMESTAMP

import { Model, DataTypes } from 'sequelize'; // Model = base class, DataTypes = column types
import sequelize from '../config/database';    // our database connection instance

// Notification class = blueprint of the notifications table
// each instance = one notification delivered to one user
class Notification extends Model {
  declare id: number;
  declare user_id: number;         // which user receives this notification
  declare shop_id: number;       // which shop this notification is from
  declare type: string;            // category → "order_shipped", "flash_sale", "review_reply"
                                   // used by frontend to show correct icon + style
  declare title: string;           // short title → "Your order has shipped! 🚚"
  declare body: string;            // full message → "Your Olive Oil order is on the way!"
  declare is_read: boolean;        // false = unread (shows red badge in navbar!)
                                   // true = customer already opened it
  declare data: object | null;     // JSONB extra context:
                                   // order notification → {"order_id": 5, "status": "shipped"}
                                   // flash sale → {"product_id": 3, "discount": 50}
                                   // flexible for any notification type! 🎯
  declare created_at: Date;
}

// Notification.init() = tell Sequelize exact columns + rules for this table
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,   // whole number
      primaryKey: true,          // unique identifier for each notification
      autoIncrement: true,       // database auto-generates: 1, 2, 3...
    },
    user_id: {
      type: DataTypes.INTEGER,   // references users.id
      allowNull: false,          // required — every notification must have a recipient
    },
    shop_id: {
      type: DataTypes.INTEGER,   // references shops.id
      allowNull: false,          // required — multi-shop isolation!
    },
    type: {
      type: DataTypes.STRING,    // text value → "order_shipped", "flash_sale"
      allowNull: false,          // required — frontend needs this to pick the right icon
    },
    title: {
      type: DataTypes.STRING,    // short text → "Order Shipped!"
      allowNull: false,          // required — every notification needs a title
    },
    body: {
      type: DataTypes.TEXT,      // longer text → full notification message
      allowNull: false,          // required — every notification needs a body
    },
    is_read: {
      type: DataTypes.BOOLEAN,   // true or false only
      defaultValue: false,       // new notifications are unread by default ✅
    },
    data: {
      type: DataTypes.JSONB,     // flexible JSON for extra context
      allowNull: true,           // optional — not all notifications need extra data
    },
  },
  {
    sequelize,                   // which database connection to use
    modelName: 'Notification',   // Sequelize internal model name
    tableName: 'notifications',  // exact PostgreSQL table name
    timestamps: false,           // only created_at needed — notifications never update
    underscored: true,           // converts camelCase to snake_case in DB
  }
);

export default Notification;

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  DATABASE:
    Notification.init() → Sequelize manages "notifications" table in PostgreSQL
    is_read index → fast lookup of unread notifications per user

  SERVICE:
    notification.service.ts → Notification.create({ user_id, shop_id, type, title, body })
    notification.service.ts → Notification.findAll({ where: { user_id, is_read: false } })
    notification.service.ts → notification.update({ is_read: true }) → mark as read

  RELATIONS (defined in models/index.ts):
    Notification belongs to User   (via user_id)
    Notification belongs to shop (via shop_id)

  NOTIFICATION TYPES USED IN THIS PROJECT:
    "order_confirmed"  → customer placed order successfully
    "order_shipped"    → vendor marked order as shipped
    "order_delivered"  → order marked as delivered
    "order_cancelled"  → order was cancelled
    "flash_sale"       → new flash sale started on a product
    "review_reply"     → vendor replied to customer's review

  EXAMPLE:
  ─────────
  notifications table in PostgreSQL:
  ┌────┬─────────┬────────────────┬─────────────────────────────┬─────────┐
  │ id │ user_id │ type           │ title                       │ is_read │
  ├────┼─────────┼────────────────┼─────────────────────────────┼─────────┤
  │ 1  │ 2       │ order_shipped  │ Your order is on the way!   │ false   │ ← unread 🔴
  │ 2  │ 2       │ flash_sale     │ 50% off Olive Oil today!    │ true    │ ← read ✅
  └────┴─────────┴────────────────┴─────────────────────────────┴─────────┘
*/