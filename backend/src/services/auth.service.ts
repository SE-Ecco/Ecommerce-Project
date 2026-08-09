// WHAT: Business logic for authentication — register, login, get user
// IMPORTS: models/User.ts, utils/password.ts, utils/jwt.ts
// USED BY: controllers/auth.controller.ts
// LOGIC: check email exists → hash password → create user → generate token
// NOTE: New users register as 'customer' by default. super_admin creates shop_admins.

import User from '../models/User'                                   // Sequelize model — talks to users table in DB
import { generateToken } from '../utils/jwt'                        // creates JWT token with user data inside
import { hashPassword, comparePassword } from '../utils/password'   // bcrypt functions — hash + compare
import { TokenPayload } from '../types'                             // TypeScript type — shape of JWT payload

// ===========================
// REGISTER
// ===========================

export const register = async (
  full_name: string, // user's full name from req.body
  email: string,     // user's email from req.body
  password: string,  // user's plain password from req.body
) => {

  // 1. check if email already exists — no duplicate accounts!
  const existingUser = await User.findOne({ where: { email } });
  // User.findOne() → searches users table for ONE row where email matches
  // returns User object if found, null if not found
  if (existingUser) throw new Error('Email already exists');
  // already exists? → throw error → controller catches it → sends 400 to client 🛑

  // 2. hash the password — NEVER store plain text passwords!
  const hashedPassword = await hashPassword(password);
  // hashPassword() → bcrypt.hash(password, 12) → "$2b$12$x8Kq2..." long scrambled string
  // await → hashing takes time, wait for it to finish

  // 3. create new user in database with hashed password
  const newUser = await User.create({
    name: full_name,               // 🔧 fix: model uses 'name' not 'full_name'
    email,                         // shorthand for email: email
    password_hash: hashedPassword, // 🔧 fix: model uses 'password_hash' not 'password'
    role: 'customer',
    phone: null, // ← add this              // HARDCODED — nobody self-promotes to admin! security rule ✅
  });
  // User.create() → INSERT INTO users (...) VALUES (...) → returns created user row

  // 4. build token payload — data that lives INSIDE the JWT token
  const payload: TokenPayload = {
    id: newUser.id,                        // who is this token for?
    email: newUser.email,                  // their email
    role: newUser.role,                    // always 'customer' for new users
    shop_id: newUser.shop_id ?? undefined, // null → undefined (customers have no shop)
    // ?? = nullish coalescing: null/undefined → undefined, number → keeps number
  };

  const token = generateToken(payload); // jwt.sign(payload, secret, { expiresIn: '7d' })
  // token = long string like "eyJhbGciOiJIUzI1NiJ9.abc123..."

  const { password_hash: _, ...safeUser } = newUser.toJSON(); // 🔧 fix: strip password_hash not password
  return { user: safeUser, token };
  // sent back to controller → controller sends to client
};

// ===========================
// LOGIN
// ===========================

export const login = async (
  email: string,    // email from req.body
  password: string, // plain password from req.body
) => {

  // 1. find user by email — do they exist?
  const user = await User.findOne({ where: { email } });
  // searches users table for row where email matches
  if (!user) throw new Error('Invalid email or password');
  // ⚠️ SECURITY: same message for wrong email AND wrong password!
  // hacker can't tell WHICH one is wrong → can't guess valid emails! 🔒

  // 2. compare plain password with stored hash
  const isPasswordMatch = await comparePassword(password, user.password_hash);
  // comparePassword() → bcrypt.compare(plain, hash) → true or false
  // bcrypt internally hashes the plain password and compares with stored hash
  if (!isPasswordMatch) throw new Error('Invalid email or password');
  // wrong password? same message as above → hacker learns nothing 🔒

  // 3. generate JWT token — user is verified, give them their key
  const payload: TokenPayload = {
    id: user.id,                        // who is this?
    email: user.email,                  // their email
    role: user.role,                    // their role → used for authorization
    shop_id: user.shop_id ?? undefined, // their shop → used for multi-tenancy
  };

  const token = generateToken(payload); // create token with 7 day expiry
  const { password_hash: _, ...safeUser } = user.toJSON(); // 🔧 fix: strip password_hash
  return { user: safeUser, token }; // sent back to controller → controller sends to client
};

// ===========================
// GET ME
// ===========================

export const getMe = async (id: number) => {
  // id comes from req.user.id (already verified by auth.middleware)
  const user = await User.findByPk(id);
  // findByPk() = "find by Primary Key" → SELECT * FROM users WHERE id = ?
  // takes id directly — no { where } needed (unlike findOne)

  if (!user) throw new Error('User not found');
  // shouldn't happen (token is valid = user exists) but safety check ✅
  const { password_hash: _, ...safeUser } = user.toJSON(); // 🔧 fix: strip password_hash
  return safeUser; // sent back to controller
};

/*
  HOW THIS FILE WORKS — FULL PICTURE:
  ─────────────────────────────────────────────────────────────────

  THIS FILE = the chef 🍳
  it does ALL the real work — controller just calls these functions

  3 FUNCTIONS:
    register() → check email → hash password → create user → return token
    login()    → find user → compare password → return token
    getMe()    → find user by id → return user

  IMPORTANT HARDCODED RULES:
    1. role: 'customer' → ALWAYS on register, never from request
       why? → if role came from req.body, hacker sends role: 'super_admin' 😱

    2. same error message for wrong email AND wrong password on login
       why? → hacker can't tell which one is wrong → can't enumerate valid emails 🔒

    3. password ALWAYS hashed before saving
       why? → database breach → hacker gets hashes not real passwords 🔒

    4. shop_id ?? undefined → converts null to undefined
       why? → TokenPayload expects undefined, User model returns null

  EXAMPLE — register flow:
  ─────────────────────────
  POST /api/auth/register
  body: { full_name: "Alan", email: "alan@gmail.com", password: "mypass123" }
        ↓
  findOne({ where: { email } }) → null (not found) ✅
        ↓
  hashPassword("mypass123") → "$2b$12$x8Kq2..." ✅
        ↓
  User.create({ name: "Alan", email: "alan@gmail.com",
                password_hash: "$2b$12$...", role: "customer" }) ✅
        ↓
  generateToken({ id: 1, email: "alan@gmail.com",
                  role: "customer", shop_id: undefined }) ✅
        ↓
  return { user: { id:1, email:... }, token: "eyJhbG..." } ✅

  EXAMPLE — login flow:
  ──────────────────────
  POST /api/auth/login
  body: { email: "alan@gmail.com", password: "mypass123" }
        ↓
  findOne({ where: { email } }) → User object found ✅
        ↓
  comparePassword("mypass123", "$2b$12$...") → true ✅
        ↓
  generateToken({ id: 1, email: "alan@gmail.com",
                  role: "customer", shop_id: undefined }) ✅
        ↓
  return { user: { id:1, ... }, token: "eyJhbG..." } ✅

  EXAMPLE — wrong password:
  ──────────────────────────
  comparePassword("wrongpass", "$2b$12$...") → false ❌
  throw new Error('Invalid email or password') 🛑
  same message as "user not found" → hacker learns nothing 🔒
*/