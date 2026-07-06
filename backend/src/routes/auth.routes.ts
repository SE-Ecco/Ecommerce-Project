// WHAT: Maps auth URLs to middleware chain + controller functions
// IMPORTS: auth.controller, auth.validation, validate.middleware, rateLimiter.middleware
// REGISTERED IN: app.ts as /api/auth
// ROUTES:
//   POST /api/auth/register → [authLimiter, registerValidation, validateMiddleware] → register()
//   POST /api/auth/login    → [authLimiter, loginValidation, validateMiddleware]    → login()
//   GET  /api/auth/me       → [authenticate]                                        → getMe()

import { Router } from 'express';                                        // Router = mini Express app for one feature
import { validateMiddleware } from '../middleware/validate.middleware';   // checks validation results → stops if errors exist
import { registerValidation, loginValidation } from '../validations/auth.validation'; // arrays of express-validator rules
import * as authController from '../controllers/auth.controller';   // register, login, getMe functions
import { authLimiter } from '../middleware/rateLimiter.middleware';       // max 10 requests per 15 min per IP
import { authenticate } from '../middleware/auth.middleware';             // verifies JWT token → attaches req.user

const router = Router(); // create a mini router — only handles /api/auth/* routes

// ===========================
// POST /api/auth/register
// ===========================
router.post(
  '/register',         // full path → /api/auth/register (prefix added in app.ts)
  authLimiter,         // 1st: max 10 attempts per 15 min → stops bot spam 🤖
  registerValidation,  // 2nd: array of body() rules → checks full_name, email, password format
  validateMiddleware,  // 3rd: reads validation results → if errors exist, returns 400 immediately 🛑
  authController.register // 4th: only reaches here if all above pass → creates user + returns token ✅
);

// ===========================
// POST /api/auth/login
// ===========================
router.post(
  '/login',            // full path → /api/auth/login
  authLimiter,         // 1st: max 10 attempts per 15 min → stops brute-force attacks 🔒
  loginValidation,     // 2nd: array of body() rules → checks email format, password not empty
  validateMiddleware,  // 3rd: reads validation results → if errors exist, returns 400 immediately 🛑
  authController.login // 4th: only reaches here if all above pass → checks credentials + returns token ✅
);

// ===========================
// GET /api/auth/me
// ===========================
router.get(
  '/me',               // full path → /api/auth/me
  authenticate,        // 1st: verifies JWT token → extracts { id, email, role, shop_id } → attaches to req.user
                       //      no token or invalid token → 401 immediately 🛑
  authController.getMe // 2nd: reads req.user.id → finds user in DB → returns user data ✅
  // no authLimiter here → already authenticated, no brute-force risk
  // no validation here  → no body data sent, nothing to validate
);

export default router; // exported → imported by app.ts → registered as /api/auth

/*
  HOW THIS FILE WORKS — FULL PICTURE:
  ─────────────────────────────────────────────────────────────────

  WHAT IS A ROUTER?
    router = mini Express app for ONE feature only
    app.ts imports this router → mounts it at /api/auth
    so '/register' here = '/api/auth/register' in the real app

  MIDDLEWARE CHAIN — how it works:
    each argument after the path = one step in the chain
    steps run LEFT TO RIGHT, one by one
    any step can STOP the chain by sending a response
    only if ALL steps pass → controller runs ✅

  REGISTER CHAIN:
    authLimiter      → too many attempts? 🛑
    registerValidation → bad data format? 🛑
    validateMiddleware → any validation errors? 🛑
    authController.register → all good! create user ✅

  LOGIN CHAIN:
    authLimiter      → too many attempts? 🛑
    loginValidation  → bad data format? 🛑
    validateMiddleware → any validation errors? 🛑
    authController.login → all good! check credentials ✅

  ME CHAIN:
    authenticate     → invalid/missing token? 🛑
    authController.getMe → all good! return user ✅

  EXAMPLE — POST /api/auth/register with bad email:
  ───────────────────────────────────────────────────
  body: { full_name: "Alan", email: "notanemail", password: "mypass123" }
        ↓
  authLimiter      → under limit ✅ passes
  registerValidation → email fails isEmail() rule
  validateMiddleware → errors found! → 400 { message: "Email must be valid" } 🛑
  controller never runs!

  EXAMPLE — GET /api/auth/me with valid token:
  ─────────────────────────────────────────────
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        ↓
  authenticate → token valid ✅ → req.user = { id:1, email:"alan@gmail.com", role:"customer" }
        ↓
  authController.getMe → finds user by req.user.id → returns user ✅
*/