// WHAT: Verifies JWT token — protects routes from unauthenticated access
// IMPORTS: jsonwebtoken, env, express types
// USED BY: All protected routes in routes/*.ts
// FLOW: read Authorization header → verify token → attach to req.user → next()
// ERROR: 401 if no token or invalid token
// EXPORTS: authenticate()

import { Request, Response, NextFunction } from 'express'; // Request = req type, Response = res type, NextFunction = next type
import jwt from 'jsonwebtoken';                            // JWT library — verifies tokens
import { env } from '../config/env';                      // env.JWT_SECRET — the secret key used to verify token signature

export const authenticate = (  // exported function — used in routes as middleware
  req: Request,                // incoming HTTP request
  res: Response,               // outgoing HTTP response
  next: NextFunction           // function that passes control to next middleware/controller
): void => {                   // returns nothing — just calls next() or res.json()

  // 1. get token from Authorization header → "Bearer eyJhbG..." → split → take [1]
  const token = req.headers.authorization?.split(' ')[1];
  // req.headers.authorization  → reads the Authorization header from the request
  //                               value looks like: "Bearer eyJhbGciOiJIUzI1NiJ9.abc123..."
  // ?.                         → optional chaining — if header doesn't exist, return undefined safely (no crash)
  // .split(' ')                → splits string by space into array → ["Bearer", "eyJhbGciOiJIUzI1NiJ9..."]
  // [1]                        → takes second item (index 1) → the actual token, skipping "Bearer"

  // 2. no token? stop immediately — cannot proceed without identity
  if (!token) {                                           // token is undefined or empty string
    res.status(401).json({ message: 'No token provided' }); // 401 = Unauthorized — identity required
    return;                                               // stop here — don't call next()
  }

  // 3. verify token — if invalid or expired, catch block fires
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { // jwt.verify() checks signature + expiry
      id: number;       // who is this token for?
      email: string;    // their email — baked into token by generateToken() in jwt.ts
      role: string;     // their role — 'super_admin' | 'shop_admin' | 'customer'
      shop_id?: number; // their shop — undefined for super_admin + customers
    };
    // as { ... } → tells TypeScript what shape the decoded data has (type casting)

    // 4. attach decoded data to req.user — available in every controller after this
    req.user = {
      id: decoded.id,           // who is making this request
      email: decoded.email,     // their email
      role: decoded.role,       // their role — used for authorization checks
      shop_id: decoded.shop_id, // their shop — used for multi-tenancy (WHERE shop_id = req.user.shop_id)
    };

    next(); // ✅ all checks passed — pass control to next middleware or controller

  } catch {
    // jwt.verify() threw an error — token is invalid, expired, or tampered with
    res.status(401).json({ message: 'Invalid or expired token' }); // 401 = Unauthorized
  }

};

/*
  HOW THIS FILE WORKS:
  ─────────────────────────────────────────────────────────────────

  FLOW:
    request hits protected route (e.g. GET /api/auth/me)
          ↓
    authenticate() runs
          ↓
    reads Authorization header → "Bearer eyJhbG..."
    splits on space → takes second part → the actual token
          ↓
    token missing? → 401 immediately 🛑
          ↓
    jwt.verify() checks:
      → is signature valid? (not tampered)
      → is token expired?
      → is secret correct?
          ↓
    invalid? → catch fires → 401 🛑
          ↓
    valid? → decoded = { id, email, role, shop_id }
    attached to req.user ✅
          ↓
    next() → controller runs

  EXAMPLE — valid token:
  ───────────────────────
  Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        ↓
  decoded → { id: 1, email: "alan@gmail.com", role: "shop_admin", shop_id: 2 }
  req.user = { id: 1, email: "alan@gmail.com", role: "shop_admin", shop_id: 2 }
  next() ✅ → controller reads req.user freely

  EXAMPLE — missing token:
  ─────────────────────────
  Authorization: undefined
        ↓
  401 → { message: "No token provided" } 🛑

  EXAMPLE — expired token:
  ─────────────────────────
  token was valid but 7 days passed
        ↓
  jwt.verify() throws error
  catch fires → 401 → { message: "Invalid or expired token" } 🛑
*/
