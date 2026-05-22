// WHAT: TypeScript interfaces — the shape of every data object
// IMPORTS: Nothing
// USED BY: EVERY file that deals with data (services, stores, pages, components)
// CONTAINS:
//
//   User     → id, shop_id, full_name, email, phone, role, created_at
//   Shop     → id, name, slug, description, logo_url, is_active, created_at
//   Category → id, shop_id, name, created_at
//   Product  → id, shop_id, category_id, name, description, price, stock, image_url, is_available, created_at
//   Order    → id, shop_id, user_id, total_price, status, address, created_at, items?: OrderItem[]
//   OrderItem → id, shop_id, order_id, product_id, quantity, unit_price, product?: Product
//   CartItem → product: Product, quantity: number
//   ApiResponse<T> → success, message, data: T
//   PaginatedResponse<T> → data: T[], total, page, limit, totalPages
