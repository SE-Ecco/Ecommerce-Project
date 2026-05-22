// WHAT: Handles image file uploads directly to Cloudinary via Multer
// IMPORTS: multer, multer-storage-cloudinary, config/cloudinary.ts
// USED BY: routes/product.routes.ts (create product endpoint), routes/shop.routes.ts (update logo)
// RESULT: After this runs, req.file.path = the Cloudinary image URL — save this to DB!
// LIMITS: 5MB max, jpeg/png/webp only
// EXPORTS: upload
