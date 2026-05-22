// WHAT: Creates "order_items" table — references orders + products + shops (run LAST)
// COLUMNS: id, shop_id (FK), order_id (FK), product_id (FK), quantity, unit_price
// ⚠️ unit_price is a SNAPSHOT of the price at the time of purchase
//    This is critical: product.price can change later but order_item.unit_price stays the same!
