// WHAT: Backend TypeScript types shared across controllers, services, middleware
// IMPORTS: Nothing
// CONTAINS: JwtPayload, PaginationOptions, ProductQueryParams, OrderQueryParams
// ROLES: 'super_admin' | 'shop_admin' | 'customer'

// ===========================
// ROLES
// ===========================

export type Role = 'super_admin' | 'shop_admin' | 'customer'
//     ↑              ↑                ↑               ↑
//     share it    only these 3 values allowed
//
// type = defines a VALUE shape (not an object)
// | = OR → must be one of these exactly
// 'hacker' → ❌ TypeScript error immediately!


// ===========================
// USER
// ===========================

export interface User {
//     ↑
//     share with other files

  id: number           // database row number
  email: string        // login email
  password: string     // hashed password
  role: Role           // must be one of 3 roles above
  shop_id?: number     // ? = optional (admins have it, customers don't)
  createdAt: Date      // when they registered
}


// ===========================
// TOKEN PAYLOAD
// ===========================

export interface TokenPayload {
  id: number           // who is this token for?
  email: string        // their email
  role: Role           // their role
  shop_id?: number     // their shop (if shop_admin)
}
// this is what lives INSIDE the JWT token
// auth.middleware reads this when token arrives


// ===========================
// SHOP
// ===========================

export interface Shop {
  id: number
  name: string         // "Zaytoon Store"
  slug: string         // "zaytoon-store" (URL friendly name)
  description?: string // optional shop description
  isActive: boolean    // true = open, false = closed by admin
  createdAt: Date
}


// ===========================
// CATEGORY
// ===========================

export interface Category {
  id: number
  name: string         // "Electronics", "Food"
  shop_id: number      // which shop owns this category
}


// ===========================
// PRODUCT
// ===========================

export interface Product {
  id: number
  name: string
  description?: string  // optional
  price: number         // in IQD
  stock: number         // how many left
  image?: string        // Cloudinary URL (optional)
  isActive: boolean     // visible to customers?
  shop_id: number       // which shop sells this
  category_id?: number  // optional category
  createdAt: Date
}


// ===========================
// ORDER
// ===========================

export interface Order {
  id: number
  status: string        // "pending", "confirmed", "delivered"
  total: number         // total price in IQD
  shop_id: number       // which shop got this order
  user_id: number       // who placed the order
  createdAt: Date
}


// ===========================
// ORDER ITEM
// ===========================

export interface OrderItem {
  id: number
  order_id: number      // which order
  product_id: number    // which product
  quantity: number      // how many
  unit_price: number    // price AT TIME of order (snapshot!)
}
// unit_price = snapshot because:
// product price changes tomorrow → old order still shows original price ✅
// just like a real receipt 🧾


// ===========================
// API RESPONSE
// ===========================

export interface ApiResponse {
  success: boolean      // true or false
  data?: any            // the actual result (optional)
  message?: string      // error or success message (optional)
}
// every controller uses this format:
// success: { success: true, data: [...] }
// error:   { success: false, message: "not found" }