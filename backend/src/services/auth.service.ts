// WHAT: Business logic for authentication — register, login, get user
// IMPORTS: models/User.ts, utils/password.ts, utils/jwt.ts
// USED BY: controllers/auth.controller.ts
// LOGIC: check email exists → hash password → create user → generate token
// NOTE: New users register as 'customer' by default. super_admin creates shop_admins.
