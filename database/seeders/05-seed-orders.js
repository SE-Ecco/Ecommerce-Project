// WHAT: Inserts sample orders + order_items for testing
// DATA:
//   2-3 orders per shop with various statuses
//   Each order has 1-3 order_items
// FIELDS (orders): shop_id, user_id, total_price, status, address
// FIELDS (order_items): shop_id, order_id, product_id, quantity, unit_price
// ⚠️ total_price must equal SUM(quantity * unit_price) for the order's items!
