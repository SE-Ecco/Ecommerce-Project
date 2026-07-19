// WHAT: Handles image file uploads directly to Cloudinary via Multer
// IMPORTS: multer, multer-storage-cloudinary, config/cloudinary.ts
// USED BY: routes/product.routes.ts (create product endpoint), routes/shop.routes.ts (update logo)
// RESULT: After this runs, req.file.path = the Cloudinary image URL — save this to DB!
// LIMITS: 5MB max, jpeg/png/webp only
// EXPORTS: upload
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary'

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'products',
    }
  },
})
export const upload = multer({ storage: storage })



// 📖 upload.middleware.ts — FULL story, every line explained 🎬

// 🎭 the big picture
// 🏪 imagine you're a shop owner adding a NEW product with a photo

// 1️⃣ you fill a form: name, price, AND attach a photo file 📸
// 2️⃣ that request travels to your backend
// 3️⃣ BEFORE your controller even sees it, this middleware
//    intercepts the photo, drives it to Cloudinary, and
//    comes back with a clean URL attached to the request
// 4️⃣ THEN your controller runs, already holding that photo URL
// This file is the delivery guy 🛵 — grabs the package, drops it off at the photo studio, comes back with a receipt (URL), hands it to the front desk (controller).

// 🧠 line by line
// typescriptimport multer from 'multer'
// 📌 multer = the base library that understands "multipart/form-data"
//     (the special format browsers use when a form includes a FILE, not just text)
// 📌 without multer, req.body would be EMPTY when a file is attached —
//     Express alone doesn't know how to read file uploads
// 🧠 relate it: normal form data (text) is like a plain letter ✉️. A form WITH a file attached is like a package 📦 — you need a special delivery service (multer) that knows how to handle packages, not just letters.

// typescriptimport { CloudinaryStorage } from 'multer-storage-cloudinary'
// 📌 multer by itself can save files to YOUR OWN server's disk (basic setup)
// 📌 but you DON'T want that — you want files to go to Cloudinary instead
// 📌 CloudinaryStorage = a special "storage engine" you can hand to multer
//     that says "instead of saving to disk, send it to Cloudinary"
// 🧠 relate it: multer = the delivery truck 🚚 (works with ANY destination). CloudinaryStorage = telling the truck driver "today's destination is Cloudinary, not the local warehouse."

// typescriptimport cloudinary from '../config/cloudinary'
// 📌 imports the ALREADY-CONFIGURED Cloudinary connection you built earlier
// 📌 already knows your cloud_name, api_key, api_secret
// 📌 this file doesn't need to configure anything again — just REUSES it

// typescriptconst storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: 'products',
//     }
//   },
// })
// 📌 new CloudinaryStorage({...}) → creates a NEW storage engine object
//     this object knows HOW and WHERE to save files (Cloudinary, "products" folder)

// 📌 cloudinary: cloudinary → "use THIS specific Cloudinary connection"
//     (the one already configured with your secret keys)

// 📌 params: async (req, file) => { ... } → 
//     a FUNCTION that runs EVERY TIME someone uploads a file
//     (req = the request, file = info about the file being uploaded)

// 📌 return { folder: 'products' } →
//     tells Cloudinary: "put this specific file inside a folder
//     called 'products' up in the cloud" 📁
//     (keeps your Cloudinary account organized — all product
//     photos live together, separate from say, shop logos later)
// 🧠 relate it: imagine a photo printing shop ☁️ that asks EVERY time you drop off a roll of film: "which album should this go in?" — this function is your standing answer: "always put it in the 'products' album."

// typescriptconst upload = multer({ storage: storage })
// 📌 NOW we create the ACTUAL middleware function
// 📌 multer({...}) → configure multer to use OUR custom storage
//     (instead of its default "save to local disk" behavior)
// 📌 storage: storage → "use the Cloudinary storage engine we just built above"

// 📌 this "upload" variable is now a fully working middleware —
//     ready to plug into any route that needs file uploads
// 🧠 relate it: this is like finally HIRING the delivery guy, after building his truck (multer) and giving him the destination address (CloudinaryStorage) — now he's ready to actually do deliveries.

// typescriptexport default upload
// 📌 makes "upload" available to OTHER files
// 📌 specifically → product.routes.ts will import this
//     and plug it into the CREATE PRODUCT route, like:

//     router.post('/', authenticate, shopMiddleware, upload.single('image'), createProductValidation, validateMiddleware, createProduct)
//                                                      👆 NEW! goes here
// 🧠 note for later: you'll actually call upload.single('image') when wiring it into routes — .single('image') means "expect exactly ONE file, sent under the field name 'image'" — that's a detail for when we UPDATE product.routes.ts next, not part of THIS file.

// 🔗 the FULL journey of one photo, start to finish
// 1️⃣ shop owner submits form with image file attached
//         ↓
// 2️⃣ request hits product.routes.ts
//         ↓
// 3️⃣ authenticate → checks login ✅
//         ↓
// 4️⃣ shopMiddleware → checks which shop ✅
//         ↓
// 5️⃣ upload.single('image') ← THIS FILE runs here
//    → multer intercepts the file
//    → CloudinaryStorage engine sends it to Cloudinary
//    → Cloudinary saves it in the 'products' folder
//    → Cloudinary sends back a URL
//    → multer attaches that info onto req.file
//         ↓
// 6️⃣ createProductValidation → checks name/price/stock ✅
//         ↓
// 7️⃣ validateMiddleware → checks for validation errors ✅
//         ↓
// 8️⃣ createProduct controller runs
//    → reads req.file.path (the Cloudinary URL!)
//    → passes it into productService.createProduct() as image_url
//         ↓
// 9️⃣ new product saved in DB WITH its photo URL ✅

// 🎯 the ONE sentence to remember:
// upload.middleware.ts = grabs the photo, ships it to Cloudinary,
//                        attaches the returned URL — BEFORE the
//                        controller ever touches the request
