// WHAT: Maps product URLs to middleware + controller
// IMPORTS: product.controller, auth.middleware, role.middleware, shop.middleware, upload.middleware
// REGISTERED IN: app.ts as /api/products
// ROUTES:
//   GET    /api/products                → getProducts()   (public, filtered by shop_id query)
//   GET    /api/products/:id            → getProductById() (public)
//   POST   /api/products                → [auth, authorize('shop_admin'), attachShopId, upload] → createProduct()
//   PUT    /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → updateProduct()
//   DELETE /api/products/:id            → [auth, authorize('shop_admin'), attachShopId]         → deleteProduct()
import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'
import { validateMiddleware } from '../middleware/validate.middleware'
import {
    createProductValidation,
    updateProductValidation,
    createVariantValidation,
    updateVariantValidation,
    addTagsValidation,
    createFlashSaleValidation,
} from '../validations/product.validation'
import { upload } from '../middleware/upload.middleware'
import {
    getProducts, getProductById, createProduct, updateProduct, deleteProduct,
    getVariants, createVariant, updateVariant, deleteVariant,
    getProductImages, addProductImage, setPrimaryImage, deleteProductImage,
    logSearch, logProductView,
    addTags, getProductsByTagHandler,
    createFlashSaleHandler, getActiveFlashSaleHandler
} from '../controllers/product.controller'

const router = Router()

router.post('/:id/views', authenticate, shopMiddleware, logProductView)
router.post('/search-log', authenticate, shopMiddleware, logSearch)
router.get('/', authenticate, shopMiddleware, getProducts)
router.get('/tags/:tagName', authenticate, shopMiddleware, getProductsByTagHandler)
router.get('/:id', authenticate, shopMiddleware, getProductById)
router.get('/:id/flash-sale', authenticate, shopMiddleware, getActiveFlashSaleHandler)
router.get('/:id/images', authenticate, shopMiddleware, getProductImages)
router.get('/:id/variants', authenticate, shopMiddleware, getVariants)
router.post('/', authenticate, shopMiddleware, upload('products').single('image'), createProductValidation, validateMiddleware, createProduct)
router.post('/:id/flash-sale', authenticate, shopMiddleware, createFlashSaleValidation, validateMiddleware, createFlashSaleHandler)
router.post('/:id/variants', authenticate, shopMiddleware, createVariantValidation, validateMiddleware, createVariant)
router.post('/:id/tags', authenticate, shopMiddleware, addTagsValidation, validateMiddleware, addTags)
router.post('/:id/images', authenticate, shopMiddleware, upload('products').single('image'), addProductImage)
router.put('/:id', authenticate, shopMiddleware, upload('products').single('image'), updateProductValidation, validateMiddleware, updateProduct)
router.put('/:id/variants/:variantId', authenticate, shopMiddleware, updateVariantValidation, validateMiddleware, updateVariant)
router.patch('/:id/images/:imageId/primary', authenticate, shopMiddleware, setPrimaryImage)
router.delete('/:id', authenticate, shopMiddleware, deleteProduct)
router.delete('/:id/variants/:variantId', authenticate, shopMiddleware, deleteVariant)
router.delete('/:id/images/:imageId', authenticate, shopMiddleware, deleteProductImage)

export default router

// 📖 product.routes.ts — FULL explanation, every route 🎬

// 🎭 the big picture
// 🛂 this file = airport security checkpoints, one line PER route

// each route = a different "flight" (URL + method)
// each middleware BEFORE the controller = a checkpoint that must be passed
// if ANY checkpoint fails → request STOPS, controller never runs

// typescriptimport { Router } from 'express'
// 📌 Router = Express's toolkit for building a group of related routes
// 📌 without this, you can't use router.get(), router.post(), etc
// typescriptimport { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller'
// 📌 pulls in all 5 controller functions (the "waiters" who call services)
// 📌 each will be assigned to exactly ONE route below
// typescriptimport { authenticate } from '../middleware/auth.middleware'
// import { shopMiddleware } from '../middleware/shop.middleware'
// import { validateMiddleware } from '../middleware/validate.middleware'
// import { upload } from '../middleware/upload.middleware'
// import { createProductValidation, updateProductValidation } from '../validations/product.validation'
// 📌 5 imports = 5 "checkpoint" tools this file will reuse
// 📌 all built in earlier sessions — this file just WIRES them together
// typescriptconst router = Router()
// 📌 creates a blank router object — about to attach routes to it

// 🎯 route 1 — GET all products
// typescriptrouter.get('/', authenticate, shopMiddleware, getProducts)
// 📌 GET /api/products (once registered in app.ts)

// checkpoint order:
// 1️⃣ authenticate    → are you logged in? attaches req.user (with shop_id)
// 2️⃣ shopMiddleware  → does req.user actually HAVE a shop_id? blocks if missing
// 3️⃣ getProducts     → controller runs, fetches ALL products for YOUR shop only

// 🧠 no upload/validation needed — GET requests have no file, no body to check,
//     just "give me data" — nothing to validate

// 🎯 route 2 — GET one product
// typescriptrouter.get('/:id', authenticate, shopMiddleware, getProductById)
// 📌 GET /api/products/5

// :id → dynamic URL segment, becomes req.params.id in the controller
//       (converted from string "5" to number 5 inside the controller)

// same 2 checkpoints as above, then getProductById runs
//    → finds product WHERE id = 5 AND shop_id = yours only 🔒

// 🎯 route 3 — CREATE product (busiest route!)
// typescriptrouter.post('/', authenticate, shopMiddleware, upload.single('image'), createProductValidation, validateMiddleware, createProduct)
// 📌 POST /api/products — 5 checkpoints in a row, IN THIS EXACT ORDER:

// 1️⃣ authenticate           → logged in? attaches req.user
// 2️⃣ shopMiddleware         → has a shop_id? blocks if not
// 3️⃣ upload.single('image') → grabs the photo file (field name "image"),
//                              ships it to Cloudinary, attaches
//                              the returned URL onto req.file
// 4️⃣ createProductValidation → checks req.body: name/price/stock valid?
//                              (runs AFTER upload — because multer needs
//                              to process the form FIRST before req.body
//                              fields are even readable, when using
//                              multipart/form-data!)
// 5️⃣ validateMiddleware     → reads validation results,
//                              400 error if anything failed
// 6️⃣ createProduct          → FINALLY the controller runs,
//                              reads req.body + req.file.path,
//                              saves everything to the database
// 🧠 why upload comes BEFORE validation — important order detail:
// when a form includes a FILE, the request format is "multipart/form-data"
// (not plain JSON) — Express/validation libraries can't read req.body
// text fields properly until multer has FIRST parsed the whole form
// → that's why upload.single() MUST run before createProductValidation

// 🎯 route 4 — UPDATE product
// typescriptrouter.put('/:id', authenticate, shopMiddleware, upload.single('image'), updateProductValidation, validateMiddleware, updateProduct)
// 📌 PUT /api/products/5 — SAME 6 checkpoints as create, just:
//    - uses :id (which product to update)
//    - uses updateProductValidation (all fields OPTIONAL, since
//      shop owner might update just the price, not the whole thing)
//    - photo upload also optional in practice — if no new file attached,
//      multer just does nothing, existing image_url stays unchanged

// 🎯 route 5 — DELETE product
// typescriptrouter.delete('/:id', authenticate, shopMiddleware, deleteProduct)
// 📌 DELETE /api/products/5

// only 2 checkpoints needed:
// 1️⃣ authenticate   → logged in?
// 2️⃣ shopMiddleware → owns a shop?
//    (no validation, no upload — deleting needs no body data at all,
//     just needs to know WHO is deleting and WHICH product)

// deleteProduct controller then does the security double-check:
//    WHERE id = 5 AND shop_id = yours → only deletes if it's really yours 🔒

// typescriptexport default router
// 📌 makes this whole router available to app.ts
// 📌 app.ts will plug it in like: app.use('/api/products', productRoutes)
//    which turns '/' into '/api/products', ':id' into '/api/products/:id', etc

// 🔗 side-by-side comparison — WHY each route has different checkpoints
// GET     → auth + shop                                    (just reading, nothing to check)
// POST    → auth + shop + upload + validate-array + validate (creating = strictest, needs everything)
// PUT     → auth + shop + upload + validate-array + validate (updating = same strictness, optional fields)
// DELETE  → auth + shop                                    (destroying = simple, no data to check)
// 🧠 the ONE pattern to remember:
// more DANGEROUS/DATA-HEAVY actions (create/update) = more checkpoints
// simpler actions (read/delete) = fewer checkpoints, but SAME security base (auth + shop)
