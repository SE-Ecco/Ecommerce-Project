import { Router } from 'express'
import { addToCart, getCart, updateQuantity, removeFromCart } from '../controllers/cart.controller'
import { authenticate } from '../middleware/auth.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'

const router = Router();

router.post('/', authenticate, shopMiddleware, addToCart)
router.get('/', authenticate, shopMiddleware, getCart)
router.put('/:id', authenticate, shopMiddleware, updateQuantity)
router.delete('/:id', authenticate, shopMiddleware, removeFromCart)

export default router

// 📖 cart.routes.ts — line by line 🛒

// typescriptimport { Router } from 'express'
// 📌 Router → Express's tool for building a group of related routes
//     in their own file, instead of cramming everything into app.ts

// typescriptimport { addToCart, getCart, updateQuantity, removeFromCart } from '../controllers/cart.controller'
// 📌 pulls in the 4 controller functions we just built
// 📌 { } around them → these are NAMED exports (not one default export)

// typescriptimport { authenticate } from '../middleware/auth.middleware'
// 📌 checks the JWT token is valid, attaches req.user
// 📌 runs FIRST on every cart route — nobody touches a cart while logged out

// typescriptimport { shopMiddleware } from '../middleware/shop.middleware'
// 📌 checks req.user.shop_id actually exists
// 📌 runs AFTER authenticate — guarantees shop_id is safe to use in the controller

// typescriptconst router = Router()
// 📌 creates a fresh, empty router — we attach routes to it below

// ─────────────────────────────────────────────

// typescriptrouter.post('/', authenticate, shopMiddleware, addToCart)
// 📌 POST /api/cart → "add a new item to my cart"
// 📌 middleware runs LEFT TO RIGHT: authenticate → shopMiddleware → addToCart
// 📌 if either middleware fails, addToCart NEVER runs

// typescriptrouter.get('/', authenticate, shopMiddleware, getCart)
// 📌 GET /api/cart → "show me what's in my cart"
// 📌 same guard chain — cart is always personal, NEVER public
//     (unlike category's GET, which had no auth at all)

// typescriptrouter.put('/:id', authenticate, shopMiddleware, updateQuantity)
// 📌 PUT /api/cart/5 → "change item #5's quantity"
// 📌 :id in the URL → becomes req.params.id inside the controller
// 📌 PUT (not PATCH) → because we're REPLACING the quantity entirely,
//     not adding to it (matches your updateQuantity logic exactly)

// typescriptrouter.delete('/:id', authenticate, shopMiddleware, removeFromCart)
// 📌 DELETE /api/cart/5 → "remove item #5 from my cart"

// typescriptexport default router
// 📌 hands this whole router off so app.ts can plug it in as
//     app.use('/api/cart', cartRoutes)

// ── 🍽️ THE STORY ──────────────────
//
// cart.routes.ts = the SIGNPOST at the store entrance 🚏
//
// it doesn't DO any of the actual work — it just tells every
// incoming request "if you want THIS, walk THIS way, but first
// show your badge at these 2 checkpoints"
//
// EVERY single cart route has the SAME 2 checkpoints in front:
//   1️⃣ authenticate  → "are you even logged in?"
//   2️⃣ shopMiddleware → "do you have a shop attached to your account?"
// only AFTER passing both does the request reach the actual
// worker (controller function)
//
// WHY no public route here (unlike categories):
//   a category page is like a store's front window — anyone
//   walking by can look in, no ID needed
//   a shopping cart is like YOUR OWN locker — only YOU should
//   ever be allowed to open it, so EVERY cart route requires login
//
// WHY PUT instead of PATCH for updateQuantity:
//   PUT means "replace this value completely" — the user is
//   sending the EXACT new quantity, not "add 1 more" — matches
//   how updateQuantity really works under the hood

