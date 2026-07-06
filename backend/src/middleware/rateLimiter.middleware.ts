// WHAT: Rate limiting middleware — prevents brute-force attacks and spam
// IMPORTS: express-rate-limit
// USED BY: app.ts (globalLimiter), routes/auth.routes.ts (authLimiter)
// EXPORTS:
//   authLimiter   → 10 requests per 15 minutes per IP (strict — login/register only)
//   globalLimiter → 100 requests per 15 minutes per IP (general — all routes)

import rateLimit from 'express-rate-limit'; // express-rate-limit package — tracks requests per IP

// ===========================
// AUTH LIMITER (strict)
// ===========================

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // time window = 15 minutes (in milliseconds: 15 × 60 × 1000)
  max: 10,                   // max 10 requests per IP within the window
  // why 10? → enough for real users, stops brute-force (trying 1000 passwords) 🔒
  message: {
    success: false,          // consistent response shape with rest of API
    message: 'Too many requests from this IP, please try again after 15 minutes',
    // clear message → user knows exactly what happened and when to retry
  },
});
// USED ON: POST /api/auth/login + POST /api/auth/register
// WHY STRICT: login → brute-force protection 🔒 | register → bot spam protection 🤖

// ===========================
// GLOBAL LIMITER (general)
// ===========================

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // same 15 minute window
  max: 100,                  // max 100 requests per IP within the window
  // why 100? → real users rarely hit 100 requests in 15 min
  //            bots and scrapers typically do → blocked! 🛑
  message: {
    success: false,          // consistent response shape
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
// USED ON: app.ts → applied to ALL routes before anything else
// WHY GENERAL: protects entire API from excessive requests, not just auth

/*
  HOW THIS FILE WORKS:
  ─────────────────────────────────────────────────────────────────

  rateLimit() → creates middleware that:
    1. tracks requests per IP address
    2. counts requests within the time window
    3. if count exceeds max → returns error message immediately 🛑
    4. window resets after windowMs milliseconds

  windowMs calculation:
    15 * 60 * 1000
    ↑    ↑    ↑
    15  min  ms
    = 900,000 milliseconds = 15 minutes

  TWO LIMITERS — different strictness:
  ──────────────────────────────────────
  authLimiter   → 10/15min  → login + register (strict) 🔒
  globalLimiter → 100/15min → all routes (general) 🛡️

  EXAMPLE — brute force attack on login:
  ───────────────────────────────────────
  hacker tries 11 passwords in 15 minutes:
  requests 1-10  → allowed through ✅
  request 11     → authLimiter blocks immediately 🛑
  response: { success: false, message: "Too many requests..." }
  hacker must wait 15 minutes → attack is useless! 🔒

  EXAMPLE — normal user:
  ───────────────────────
  user tries login → fails (wrong password) → tries again
  3-4 attempts in 15 minutes → well within limit ✅
  real users never hit the limit! 🎯
*/