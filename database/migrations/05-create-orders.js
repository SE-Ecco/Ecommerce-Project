// WHAT: Creates "orders" table — references users + shops (run after 01, 02)
// COLUMNS: id, shop_id (FK), user_id (FK), total_price, status, address, created_at, updated_at
// STATUS VALUES: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
// ⚠️ NO items JSONB column — order items are stored in the order_items table!
