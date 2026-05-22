// WHAT: Business logic for orders — create, list, update status
// IMPORTS: models/Order.ts, models/OrderItem.ts, models/Product.ts
// USED BY: controllers/order.controller.ts
// LOGIC: validate stock → snapshot prices into order_items → create order → reduce stock
// STATUSES: pending → confirmed → shipped → delivered (or cancelled at any point)
