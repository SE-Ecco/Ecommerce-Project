// WHAT: TypeScript interfaces — the shape of every data object
// IMPORTS: Nothing
// USED BY: EVERY file that deals with data (services, stores, pages, components)
// CONTAINS:
//

//   User     → id, shop_id, full_name, email, phone, role, created_at
// =========================
// User → represents a user account
// =========================
export type User = {
  id: number;                              // User ID
  shop_id: number | null;                  // null for super_admin
  name: string;                            // full name → "Ahmed Ali"
  email: string;                           // login email
  role: 'customer' | 'shop_admin' | 'super_admin'; // user role
  is_active: boolean;                      // false = disabled
  cloudinary_avatar_url: string | null;    // profile picture URL
  cloudinary_avatar_public_id: string | null; // for deleting avatar
  created_at?: string;                     // auto by Sequelize
  updated_at?: string;                     // auto by Sequelize
};


//   Shop     → id, name, slug, description, logo_url, is_active, created_at
// =========================
// Shop → represents a shop
// =========================
export type Shop = {
  id: number;                  // Shop ID
  name: string;                // Shop name
  slug: string;                // URL-friendly name
  description?: string;        // Shop description
  logo_url?: string;           // Shop logo
  is_active: boolean;          // Is the shop active?
  created_at?: string;         // Created date
};


//   Category → id, shop_id, name, created_at
// =========================
// Category → product category
// =========================
export type Category = {
  id: number;                  // Category ID
  shop_id: number;             // Owner shop
  name: string;                // Category name
  created_at?: string;         // Created date
};


//   Product  → id, shop_id, category_id, name, description, price, stock, image_url, is_available, created_at
// =========================
// Product → represents a product in a shop
// =========================  
export type Product = {
  id: number;                  // Product ID
  shop_id: number;             // Shop this product belongs to
  category_id: number;         // Category this product belongs to
  name: string;                // Product name
  description?: string;        // Product description
  price: number;               // Product price
  stock: number;               // Product stock quantity
  image_url?: string;          // Product image URL
  is_available: boolean;       // Is the product available?
  created_at?: string;         // Created date
};


//   Order    → id, shop_id, user_id, total_price, status, address, created_at, items?: OrderItem[]
// =========================
// Order → represents a customer order
// =========================  
export type Order = {
  id: number;                                                                 // Order ID
  shop_id: number;                                                            // Shop this order belongs to
  user_id: number;                                                            // User who placed the order
  total_price: number;                                                        // Total price of the order
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';   // Order status
  address: string;                                                            // Shipping address
  created_at?: string;                                                        // Created date
  items?: OrderItem[];                                                        // Optional array of order items
};


//   OrderItem → id, shop_id, order_id, product_id, quantity, unit_price, product?: Product
// =========================
// OrderItem → represents an item in an order
// =========================  
export type OrderItem = {
  id: number;          // OrderItem ID
  shop_id: number;     // Shop this order item belongs to
  order_id: number;    // Order this item belongs to
  product_id: number;  // Product this item refers to
  quantity: number;    // Quantity of the product in this order item
  unit_price: number;  // Price per unit of the product in this order item
  product?: Product;   //  Optional product details (if included in the response)
};


//   CartItem → product: Product, quantity: number
// =========================
// CartItem → represents an item in a shopping cart
// =========================
export type CartItem = {
    product: Product;  // Product details
    quantity: number;  // Quantity of the product in the cart
};


//   ApiResponse<T> → success, message, data: T
// =========================
// ApiResponse<T> → represents a standard API response with a generic data type
// =========================
export type ApiResponse<T> = {
  success: boolean; // Indicates if the API request was successful
  message: string;  // Provides additional information about the API response
  data: T;          // Contains the actual data returned by the API, of type T
};


//   PaginatedResponse<T> → data: T[], total, page, limit, totalPages
// =========================
// PaginatedResponse<T> → represents a paginated API response with a generic data type
// =========================
export type PaginatedResponse<T> = {
  data: T[];          // Contains an array of data items of type T
  total: number;      // Total number of items available in the dataset
  page: number;       // Current page number in the paginated response
  limit: number;      // Number of items per page
  totalPages: number; // Total number of pages
};

/*
==========================================
📖 STORY — How all these types work together

Ahmed (User) opens Burger House (Shop).

He enters the "Burgers" (Category) section
and chooses a Cheese Burger (Product).

The burger is added to his cart
as a CartItem (Product + Quantity).

Ahmed checks out and creates an Order.

Inside that Order are several OrderItems:
- 2 × Cheese Burger
- 1 × Cola

The frontend sends a request to the backend.

The backend replies with an ApiResponse<Order>:
{
  success: true,
  message: "Order created successfully",
  data: Order
}

Later, the owner opens the Orders page.

Since there are hundreds of orders,
the backend returns a PaginatedResponse<Order>,
showing only one page at a time.

==========================================
Flow:

User
   ↓
Shop
   ↓
Category
   ↓
Product
   ↓
CartItem
   ↓
Order
   ↓
OrderItem
   ↓
ApiResponse<Order>
   ↓
PaginatedResponse<Order>
==========================================
*/
// zhegir notes
// this files is one of the most important files in the frontend, it contains all the types that are used throughout the project.
// export -> mean those objects can be imported in other files, and used to define the shape of data objects, and to ensure type safety.
// the T or <T> is a generic type parameter, it allows the ApiResponse and PaginatedResponse types to be used with any data type, making them flexible and reusable for different API responses.
// the types defined here are used in services, stores, pages, and components to ensure that the data being passed around is of the correct shape and type.
// like oop we those objects are like blueprints 
// to all developers to know what data is expected and how to use it
// and every one know each object what it contains and what it is used for
//for example we have the (user) is onject in this object i define full_name not first_name and last_name because in the backend we have full_name and we want to keep the same structure in the frontend and backend to avoid confusion and errors.
//so when the backend send the data to the frontend the json must contain full_name and not first_name and last_name
//most types are self explanatory but some of them are not like the ApiResponse<T> and PaginatedResponse<T> those two types are used to define the shape of the response from the backend
// paginated response is used when we have a lot of data and we want to split it into pages, so we don't send all the data at once and overload the frontend, so we send only a limited number of items per page and the frontend can request the next page when needed.