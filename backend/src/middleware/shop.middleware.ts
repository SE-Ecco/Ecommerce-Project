// WHAT: ⚠️ CRITICAL — The heart of multi-tenancy!
// Reads shop_id from JWT token (req.user.shop_id) and attaches to req.shopId
// IMPORTS: types/express.d.ts
// USED BY: product routes, order routes, category routes (any route that is shop-specific)
// ⚠️ SECURITY: NEVER read shop_id from req.body — always from JWT token!
//    A malicious user could send any shop_id in body and access other shops' data!
// EXPORTS: attachShopId()
import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response'

export const shopMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const shopId = req.user?.shop_id

  if (!shopId) {
    return res.status(403).json(errorResponse('Shop not found'))
  }

  next()
}

// 📖 shop.middleware.ts — line by line 🛂

// typescriptimport { Request, Response, NextFunction } from 'express'
// 📌 Request, Response → same as controller (shape of req/res)
// 📌 NextFunction → NEW type, only middleware uses this
// 📌 it's the TYPE for the "next()" function — tells TypeScript

//     "next is a function with no required args, call it to move on"
// typescriptimport { errorResponse } from '../utils/response'
// 📌 only errorResponse needed here (no successResponse)
// 📌 because middleware NEVER sends success — it either:
//    ✅ passes silently to controller (controller sends success)
//    ❌ blocks with an error

// typescriptexport const shopMiddleware = (req: Request, res: Response, next: NextFunction) => {
// 📌 export const → so it can be imported into shop.routes.ts (or app.ts)
// 📌 3 parameters this time (not 2 like controller!)
// 📌 req, res → same as always
// 📌 next → THIS is what makes it "middleware" not a controller
//     → calling next() says "I'm done checking, move to the next thing in line"

// typescript  const shopId = req.user?.shop_id
// 📌 req.user → was ATTACHED earlier by auth.middleware (runs before this one)
// 📌 ?. → "optional chaining" — safety check
//     → if req.user is undefined, don't crash, just return undefined
//     → (happens if auth.middleware didn't run, or token missing)
// 📌 .shop_id → pulls the shop_id field out of that user object
// 📌 shopId → local variable holding either a number, or undefined

// typescript  if (!shopId) {
// 📌 !shopId → "if shopId is falsy" (undefined, null, 0, etc.)
// 📌 basically: "if there's NO shop_id attached to this user"
// 📌 this catches: no token, bad token, or user has no shop assigned

// typescript    return res.status(403).json(errorResponse('Shop not found'))
// 📌 return → STOPS the function here, controller never runs
// 📌 status(403) → HTTP code meaning "Forbidden" (you're not allowed, not a server crash)
// 📌 errorResponse('Shop not found') → sends { success: false, message: 'Shop not found' }
// 📌 request DIES here if shopId is missing — very important security stop

// typescript  next()
// 📌 only reached if shopId EXISTS (if-block above didn't return)
// 📌 next() → hands control to whatever comes after this middleware
//     (usually the controller function, like getAllShops)
// 📌 without calling next(), request would just HANG forever — nothing happens

// typescript}
// 📌 closes the function

// 🎯 big picture — request lifecycle with this middleware added:
// 1️⃣ request hits route (e.g. GET /api/shops/my-shop-products)
// 2️⃣ auth.middleware runs first → verifies JWT → attaches req.user
// 3️⃣ shopMiddleware runs next → checks req.user.shop_id exists
// 4️⃣ ✅ exists → next() → controller runs
// 5️⃣ ❌ missing → 403 response → controller NEVER runs
// 🧠 why this matters for multi-tenancy: this is your security gate 🔒 — guarantees every request past this point definitely belongs to a real shop, so controller/service code can trust shop_id blindly without re-checking