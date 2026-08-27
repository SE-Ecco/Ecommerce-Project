// WHAT: Backend TypeScript types shared across controllers, services, middleware
// IMPORTS: Nothing
// CONTAINS: JwtPayload, PaginationOptions, ProductQueryParams, OrderQueryParams
// ROLES: 'super_admin' | 'shop_admin' | 'customer'

// ===========================
// ROLES
// ===========================

export type Role = 'super_admin' | 'shop_admin' | 'customer'

// ===========================
// USER
// ===========================

export interface User {
  id: number
  name: string          // ADD: user display name
  email: string
  password_hash: string // FIX: was 'password', model uses 'password_hash'
  role: Role
  shop_id?: number
  created_at: Date      // FIX: was 'createdAt', model uses snake_case
}

// ===========================
// TOKEN PAYLOAD
// ===========================

export interface TokenPayload {
  id: number
  email: string
  role: Role
  shop_id?: number
}

// ===========================
// SHOP
// ===========================

export interface Shop {
  id: number
  name: string
  slug: string
  email: string                    // ADD: shop email
  phone?: string                   // ADD: shop phone
  cloudinary_logo_url?: string     // ADD: logo URL
  cloudinary_logo_public_id?: string // ADD: for deletion
  status: 'active' | 'inactive' | 'suspended'  // FIX: was isActive: boolean
  created_at: Date                 // FIX: was 'createdAt'
}

// ===========================
// CATEGORY
// ===========================

export interface Category {
  id: number
  name: string
  slug: string                     // ADD: URL-friendly name
  shop_id: number
  parent_id?: number               // ADD: for subcategories
  cloudinary_banner_url?: string   // ADD: banner image
}

// ===========================
// PRODUCT
// ===========================

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image_url?: string               // FIX: was 'image'
  is_active: boolean               // FIX: was 'isActive: boolean'
  shop_id: number
  category_id?: number
  attributes?: object              // ADD: JSONB flexible attributes
  deleted_at?: Date                // ADD: soft delete
  created_at: Date                 // FIX: was 'createdAt'
}

// ===========================
// ORDER
// ===========================

export interface Order {
  id: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number             // FIX: was 'total'
  discount_amount: number          // ADD: missing field
  shop_id: number
  user_id: number
  address_id?: number              // ADD: missing field
  notes?: string                   // ADD: missing field
  created_at: Date                 // FIX: was 'createdAt'
}

// ===========================
// ORDER ITEM
// ===========================

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id?: number              // ADD: missing field
  quantity: number
  unit_price: number
}

// ===========================
// API RESPONSE
// ===========================

export interface ApiResponse {
  success: boolean
  data?: any
  message?: string
}