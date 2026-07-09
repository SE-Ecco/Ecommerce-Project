// WHAT: Maps shop URLs to controller (public routes, no auth needed)
// IMPORTS: shop.controller
// REGISTERED IN: app.ts as /api/shops
// ROUTES:
//   GET /api/shops                  → getAllShops()
//   GET /api/shops/slug/:slug       → getShopBySlug()
//   GET /api/shops/:id/products     → getShopProducts()
//   GET /api/shops/:id/categories   → getShopCategories()-

import { getAllShops,getShopBySlug } from '../controllers/shop.controller'

import { Router } from 'express'

const router = Router()

router.get('/', getAllShops)
router.get('/slug/:slug', getShopBySlug)

export default router


// 📖 shop.routes.ts 
// 📖 shop.routes.ts — step by step 🍽️
// typescript// WHAT: Maps shop URLs to controller (public routes, no auth needed)
// // IMPORTS: shop.controllerr
// // REGISTERED IN: app.ts as /api/shops
// 📌 these are just comments (blueprint notes) — don't run as code
// 📌 WHAT → describes the file's job in one line
// 📌 IMPORTS → reminds you what this file pulls in
// 📌 REGISTERED IN → tells you WHERE this file gets plugged into the app
//    (app.ts will later do: app.use('/api/shops', shopRoutes))
// typescriptimport { Router } from 'express'
// 📌 Router → a mini toolkit from Express for building a group of routes
// 📌 without this, you can't create router.get(), router.post() etc
// typescriptimport { getAllShops, getShopBySlug } from '../controllers/shop.controller'
// 📌 pulling in the 2 controller functions you just finished writing ✅
// 📌 routes file doesn't DO the work — just POINTS to who does it
// typescriptconst router = Router()
// 📌 creates a new empty "router" object
// 📌 think of it as a blank clipboard 📋 — about to write menu items on it
// typescriptrouter.get('/', getAllShops)
// 📌 router.get → "when someone sends a GET request..."
// 📌 '/'        → to THIS path (which becomes /api/shops once registered in app.ts)
// 📌 getAllShops → run this controller function when that happens
// 📌 nothing here TALKS to database — just says "if this URL hit, call that function"
// typescriptrouter.get('/slug/:slug', getShopBySlug)
// 📌 '/slug/:slug' → path with a DYNAMIC part
// 📌 :slug is a placeholder — whatever the user types there
//     becomes available as req.params.slug in the controller
// 📌 example: GET /api/shops/slug/zaytoon-store
//     → :slug = "zaytoon-store" → controller reads it via req.params
// typescriptexport default router
// 📌 makes this whole router object available to OTHER files
// 📌 app.ts will import this and plug it in like:
//     app.use('/api/shops', shopRoutes)
// 📌 that's what turns '/' into '/api/shops' and
//     '/slug/:slug' into '/api/shops/slug/:slug'

// 🎯 big picture — how the 3 files connect so far:
// 1️⃣ request comes in: GET /api/shops/slug/zaytoon-store
// 2️⃣ app.ts sees /api/shops → sends it to shop.routes.ts
// 3️⃣ shop.routes.ts sees /slug/:slug → sends it to getShopBySlug (controller)
// 4️⃣ controller reads req.params.slug → calls service (next file, not written yet)
// 5️⃣ service will talk to DB → return shop data
// 6️⃣ controller sends it back wrapped in successResponse
