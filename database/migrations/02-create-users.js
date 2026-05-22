// WHAT: Creates the "users" table — references shops (run after 01)
// COLUMNS: id, shop_id (FK→shops, nullable), full_name, email (unique), password, phone, role, created_at, updated_at
// ROLES: 'super_admin' | 'shop_admin' | 'customer'
// NOTE: shop_id is NULL for super_admin users (they manage all shops)
