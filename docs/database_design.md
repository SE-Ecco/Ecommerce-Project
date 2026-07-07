// NOTE: No image files are ever stored in PostgreSQL.
// All actual image bytes live on Cloudinary. The database only stores
// the Cloudinary reference (secure URL + public_id) needed to
// display, replace, or delete the asset via the Cloudinary API.

Table tenants {
  id SERIAL [pk, increment]
  name varchar(255) [not null]
  slug varchar(255) [not null, unique]
  email varchar(255) [not null, unique]
  phone varchar(20)
  cloudinary_logo_url text
  cloudinary_logo_public_id varchar(255) [unique]
  status varchar [not null, default: 'active']
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table users {
  id SERIAL [pk, increment]
  tenant_id integer [ref: > tenants.id]
  name varchar(255) [not null]
  email varchar(255) [not null, unique]
  password_hash text [not null]
  role varchar [not null, default: 'customer']
  is_active boolean [default: true]
  cloudinary_avatar_url text
  cloudinary_avatar_public_id varchar(255) [unique]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table categories {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  name varchar(255) [not null]
  parent_id integer [ref: > categories.id]
  cloudinary_banner_url text
  cloudinary_banner_public_id varchar(255) [unique]
  created_at timestamp [default: `now()`]
}

Table products {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  category_id integer [ref: > categories.id]
  name varchar(255) [not null]
  description text
  price decimal [not null]
  stock integer [not null, default: 0]
  is_active boolean [default: true]
  deleted_at timestamp
  attributes jsonb
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table orders {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  user_id integer [not null, ref: > users.id]
  address_id integer [ref: > addresses.id]
  coupon_id integer [ref: > coupons.id]
  status varchar [not null, default: 'pending']
  total_amount decimal [not null]
  discount_amount decimal [default: 0]
  notes text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table order_items {
  id SERIAL [pk, increment]
  order_id integer [not null, ref: > orders.id]
  product_id integer [not null, ref: > products.id]
  variant_id integer [ref: > product_variants.id]
  quantity integer [not null, default: 1]
  unit_price decimal [not null]
  created_at timestamp [default: `now()`]
}

Table product_images {
  id SERIAL [pk, increment]
  product_id integer [not null, ref: > products.id]
  cloudinary_url text [not null]
  cloudinary_public_id varchar(255) [not null, unique]
  cloudinary_format varchar(10)
  cloudinary_width integer
  cloudinary_height integer
  is_primary boolean [default: false]
  sort_order integer [default: 0]
  created_at timestamp [default: `now()`]
}

Table product_variants {
  id SERIAL [pk, increment]
  product_id integer [not null, ref: > products.id]
  name varchar(100) [not null]
  sku varchar(100) [unique]
  price decimal
  stock integer [not null, default: 0]
  attributes jsonb
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table product_reviews {
  id SERIAL [pk, increment]
  product_id integer [not null, ref: > products.id]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  rating integer [not null]
  comment text
  cloudinary_photo_url text
  cloudinary_photo_public_id varchar(255) [unique]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table product_views {
  id SERIAL [pk, increment]
  product_id integer [not null, ref: > products.id]
  tenant_id integer [not null, ref: > tenants.id]
  user_id integer [ref: > users.id]
  viewed_at timestamp [default: `now()`]
}

Table tags {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  name varchar(100) [not null]
  created_at timestamp [default: `now()`]
}

Table product_tags {
  id SERIAL [pk, increment]
  product_id integer [not null, ref: > products.id]
  tag_id integer [not null, ref: > tags.id]
}

Table cart_items {
  id SERIAL [pk, increment]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  product_id integer [not null, ref: > products.id]
  variant_id integer [ref: > product_variants.id]
  quantity integer [not null, default: 1]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table wishlists {
  id SERIAL [pk, increment]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  name varchar(255) [default: 'My Wishlist']
  created_at timestamp [default: `now()`]
}

Table wishlist_items {
  id SERIAL [pk, increment]
  wishlist_id integer [not null, ref: > wishlists.id]
  product_id integer [not null, ref: > products.id]
  created_at timestamp [default: `now()`]
}

Table addresses {
  id SERIAL [pk, increment]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  label varchar(100) [default: 'Home']
  full_name varchar(255) [not null]
  phone varchar(20) [not null]
  city varchar(100) [not null]
  district varchar(100)
  street text [not null]
  notes text
  is_default boolean [default: false]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table payment_transactions {
  id SERIAL [pk, increment]
  order_id integer [not null, ref: > orders.id]
  tenant_id integer [not null, ref: > tenants.id]
  amount decimal [not null]
  status varchar [not null, default: 'pending']
  payment_method varchar(100)
  transaction_ref varchar(255) [unique]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table coupons {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  code varchar(50) [not null]
  discount_type varchar [not null]
  discount_value decimal [not null]
  min_order_amount decimal [default: 0]
  max_uses integer
  used_count integer [default: 0]
  expires_at timestamp
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
}

Table coupon_usages {
  id SERIAL [pk, increment]
  coupon_id integer [not null, ref: > coupons.id]
  user_id integer [not null, ref: > users.id]
  order_id integer [not null, ref: > orders.id]
  used_at timestamp [default: `now()`]
}

Table loyalty_points {
  id SERIAL [pk, increment]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  order_id integer [ref: > orders.id]
  points integer [not null]
  description varchar(255)
  created_at timestamp [default: `now()`]
}

Table flash_sales {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  product_id integer [not null, ref: > products.id]
  discount_pct integer [not null]
  starts_at timestamp [not null]
  ends_at timestamp [not null]
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
}

Table shop_settings {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id, unique]
  currency varchar(10) [default: 'IQD']
  language varchar(10) [default: 'ar']
  theme_color varchar(7) [default: '#3B82F6']
  meta_title varchar(255)
  meta_desc text
  extra jsonb
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table shipping_methods {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  name varchar(255) [not null]
  price decimal [not null, default: 0]
  min_days integer
  max_days integer
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
}

Table notifications {
  id SERIAL [pk, increment]
  user_id integer [not null, ref: > users.id]
  tenant_id integer [not null, ref: > tenants.id]
  type varchar(100) [not null]
  title varchar(255) [not null]
  body text [not null]
  is_read boolean [default: false]
  data jsonb
  created_at timestamp [default: `now()`]
}

Table search_logs {
  id SERIAL [pk, increment]
  tenant_id integer [not null, ref: > tenants.id]
  user_id integer [ref: > users.id]
  query varchar(255) [not null]
  results_count integer [default: 0]
  created_at timestamp [default: `now()`]
}