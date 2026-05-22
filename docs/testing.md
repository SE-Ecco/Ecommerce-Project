# 🧪 Testing Documentation
**Written by:** All teams

## Test Scenarios to Cover
### Auth
- [ ] Register with valid data → get token
- [ ] Register with existing email → 400 error
- [ ] Login wrong password → 401
- [ ] No token on protected route → 401
- [ ] Wrong role on admin route → 403

### Multi-tenancy (most important!)
- [ ] shop_admin CANNOT see other shop's products
- [ ] shop_admin CANNOT update other shop's orders
- [ ] shop_id from body is ignored (read from JWT only)
- [ ] Customer can browse any shop

### Products
- [ ] Create product → image uploaded to Cloudinary
- [ ] Product shows is_available correctly

### Orders
- [ ] Place order → stock decreases for each order_item
- [ ] Place order → unit_price is snapshot of current price
- [ ] Order items stored in order_items table (NOT JSONB)
- [ ] Status flow: pending → confirmed → shipped → delivered
- [ ] Cancel order at any stage

### Categories
- [ ] shop_admin can create categories for their shop
- [ ] shop_admin CANNOT see other shop's categories
- [ ] Products filter by category works
