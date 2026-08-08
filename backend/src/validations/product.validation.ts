// WHAT: Validation rules for product endpoints using express-validator
// WHY:  Catch bad data BEFORE it reaches the controller — fail fast, clear errors
// USED BY: routes/product.routes.ts (runs before controller)

import { body } from 'express-validator'; // body() = validates fields from req.body

// ===========================
// CREATE PRODUCT VALIDATION
// ===========================
// runs on → POST /api/products
// required fields: name, price, stock
// optional fields: description, category_id

export const createProductValidation = [

  body('name')
    .notEmpty().withMessage('Product name is required'),
  // notEmpty() → rejects empty string or missing field

  body('price')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  // isFloat()    → must be a number (allows decimals like 5000.50)
  // { gt: 0 }   → must be GREATER than 0 (can't have free or negative price!)

  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
  // isInt()     → must be whole number (can't have 0.5 items!)
  // { min: 0 }  → must be 0 or more (can't have negative stock!)

  body('description')
    .optional()                                                          // not required
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  // optional()  → skip validation if field not sent
  // isLength()  → if sent, must be at least 10 characters

];

// ===========================
// UPDATE PRODUCT VALIDATION
// ===========================
// runs on → PUT/PATCH /api/products/:id
// ALL fields optional → shop owner may update only ONE field at a time

export const updateProductValidation = [

  body('name')
    .optional()                                        // not required for update
    .notEmpty().withMessage('Product name cannot be empty'),
  // optional() + notEmpty() = "if sent, cannot be empty string"

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  // if sent → must still be valid price

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
  // if sent → must still be valid stock number

];
// ===========================
// CREATE VARIANT VALIDATION
// ===========================
// runs on → POST /api/products/:id/variants
// required: name
// optional: sku, price, stock, attributes

export const createVariantValidation = [

  body('name')
    .notEmpty().withMessage('name cannot be empty'),
  // same as createProduct name rule

  body('sku')
    .optional() 
    .isString().withMessage('SKU must be text'),
  // optional — not every shop uses SKUs

  body('price')
    .optional() 
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  // optional — NULL means use parent product price

  body('stock')
    .optional() 
    .isInt({ min: 0 }).withMessage('Stock must be 0 or more'),
  // optional — defaults to 0

];

// ===========================
// UPDATE VARIANT VALIDATION  
// ===========================
// runs on → PUT /api/products/:id/variants/:variantId
// ALL fields optional

export const updateVariantValidation = [

  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty'),

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be 0 or more'),

];

/*
  =============================
  Product Tags
  =============================
*/

export const addTagsValidation = [
  body('tagNames')
    .isArray({ min: 1}).withMessage('At least one tag is required'),
  body('tagNames.*')                                                     // tagNames.* : means validate every elements in tagNames array.
    .isString().withMessage('Each tag must be text')
    .trim()
    .isLength({
      min: 1, max: 30
    }).withMessage('Tag must be 1-30 characters'),
];

/*
  =======================
  flash sales
  =======================
*/

export const createFlashSaleValidation = [
    body('discountPct')
        .isInt({ min: 1, max: 100 }).withMessage('Discount must be 1-100'),
    body('startsAt')
        .isISO8601().withMessage('startsAt must be a valid date'),
    body('endsAt')
        .isISO8601().withMessage('endsAt must be a valid date')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startsAt)) {
                throw new Error('endsAt must be after startsAt');
            }
            return true;
        }),
];

/*
  HOW THIS FILE WORKS:
  ─────────────────────────────────────────────────────────────────

  CREATE vs UPDATE difference:
    createProductValidation → name, price, stock REQUIRED
    updateProductValidation → ALL fields optional
                              shop owner can update just price if they want

  FLOW IN PROJECT:
    POST /api/products
          ↓
    createProductValidation rules run
          ↓
    validate.middleware checks results
          ↓
    errors? → 400 { message: "Price must be a positive number" } 🛑
    no errors? → product.controller runs ✅

  EXAMPLE — create with bad data:
  ─────────────────────────────────
  body: { name: "", price: -100, stock: -5 }

  errors caught:
    "Product name is required"
    "Price must be a positive number"
    "Stock must be 0 or more"

  controller never runs! 🛑 clean and safe ✅

  EXAMPLE — create with good data:
  ──────────────────────────────────
  body: { name: "Olive Oil", price: 5000, stock: 100 }

  all rules pass → controller creates product ✅

  EXAMPLE — update only price:
  ──────────────────────────────
  body: { price: 7000 }

  only price validation runs (others skipped — optional)
  price valid → controller updates product ✅
*/