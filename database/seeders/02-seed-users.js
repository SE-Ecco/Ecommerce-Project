// WHAT: Inserts test users for all roles
// DATA:
//   { full_name: 'Super Admin', email: 'admin@duhok.com', role: 'super_admin', shop_id: null }
//   { full_name: 'Zaytoon Owner', email: 'owner@zaytoon.com', role: 'shop_admin', shop_id: 1 }
//   { full_name: 'Electronics Owner', email: 'owner@electronics.com', role: 'shop_admin', shop_id: 2 }
//   { full_name: 'Test Customer', email: 'customer@test.com', role: 'customer', shop_id: null }
// ⚠️ Always bcrypt hash passwords in seeders — never plain text!
//    Use: const bcrypt = require('bcryptjs'); bcrypt.hashSync('password123', 10)
