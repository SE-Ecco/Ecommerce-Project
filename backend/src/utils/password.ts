// WHAT: Hash passwords with bcrypt + compare on login
// IMPORTS: bcryptjs
// USED BY: services/auth.service.ts
// CONTAINS: hashPassword(plain), comparePassword(plain, hash)
// ⚠️ NEVER store plain text passwords!
