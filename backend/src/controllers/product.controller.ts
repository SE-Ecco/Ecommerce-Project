// WHAT: Handles HTTP requests for products
// IMPORTS: services/product.service.ts
// USED BY: routes/product.routes.ts
// HANDLES: GET all, GET by id, POST create, PUT update, DELETE
// ⚠️ shop_id always from req.user (JWT) — never from req.body!

import { Request, Response, NextFunction  } from 'express';
import * as productService from '../services/product.service';
import { successResponse } from '../utils/response';


export const getVariants = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const product_id = Number(req.params.id);
    const variants = await productService.getVariantsByProduct(product_id, shop_id);
    res.status(200).json(successResponse(variants));
  } catch (error) { next(error); }
};

export const createVariant = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const product_id = Number(req.params.id);
    const variant = await productService.createVariant(product_id, shop_id, req.body);
    res.status(201).json(successResponse(variant));
  } catch (error) { next(error); }
};

export const updateVariant = async (req: Request<{ id: string; variantId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.variantId); 
    const variant = await productService.updateVariant(id, shop_id, req.body);
    res.status(200).json(successResponse(variant));
  } catch (error) { next(error); }
};

export const deleteVariant = async (req: Request<{ id: string; variantId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.variantId); 
    const result = await productService.deleteVariant(id, shop_id);
    res.status(200).json(successResponse(result));
  } catch (error) { next(error); }
};

// ===========================
// GET ALL PRODUCTS
// ===========================

export const getProducts = async (req: Request, res: Response,next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number; // from JWT — guaranteed by shopMiddleware
    const products = await productService.getProducts(shop_id);
    res.status(200).json(successResponse(products));
  } catch (error) {
    next(error);
  }
};

// ===========================
// GET ONE PRODUCT
// ===========================

export const getProductById = async (req: Request<{ id: string }>, res: Response,next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id); // URL params are always strings → convert to number
    const product = await productService.getProductById(id, shop_id);
    res.status(200).json(successResponse(product));
  } catch (error) {
    next(error);
    // 404 → product not found or doesn't belong to this shop
  }
};

// ===========================
// CREATE PRODUCT
// ===========================

export const createProduct = async (req: Request, res: Response,next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const product = await productService.createProduct(shop_id, req.body);
    res.status(201).json(successResponse(product));
    // 201 → something was CREATED in database
  } catch (error) {
    next(error);
  }
};

// ===========================
// UPDATE PRODUCT
// ===========================

export const updateProduct = async (req: Request<{ id: string }>, res: Response,next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id); // convert string → number
    const product = await productService.updateProduct(id, shop_id, req.body);    
    res.status(200).json(successResponse(product));
   
  } catch (error) {
    next(error);
    // 404 → product not found or doesn't belong to this shop
  }
};

// ===========================
// DELETE PRODUCT
// ===========================

export const deleteProduct = async (req: Request<{ id: string }>, res: Response,next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id); // convert string → number
    const result = await productService.deleteProduct(id, shop_id);
    res.status(200).json(successResponse(result));
  } catch (error) { next(error);
    // 404 → product not found or doesn't belong to this shop
  }
};

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  CONTROLLER RULE:
    THIN layer — only 3 things:
      1. read from req (user, params, body)
      2. call service
      3. send res.json()

  shop_id ALWAYS from req.user.shop_id:
    set by auth.middleware (JWT token) ✅
    guaranteed by shopMiddleware (runs before controller) ✅
    NEVER from req.body → can't be faked! 🔒

  req.params.id is always STRING:
    URL → /api/products/5
    req.params.id = "5" (string)
    Number("5") = 5 (number) → service expects number ✅

  STATUS CODES:
    200 → get, update, delete success
    201 → create success (new row in database)
    404 → product not found or wrong shop
    500 → unexpected server error

  EXAMPLE — GET /api/products:
  ─────────────────────────────
  req.user.shop_id = 1 (Zaytoon Store)
        ↓
  productService.getProducts(1)
        ↓
  WHERE shop_id = 1 → only Zaytoon products ✅
        ↓
  { success: true, data: [...products] }

  EXAMPLE — DELETE /api/products/5 (wrong shop):
  ────────────────────────────────────────────────
  req.user.shop_id = 1 (Zaytoon Store)
  product 5 belongs to shop 2
        ↓
  productService.deleteProduct(5, 1)
        ↓
  WHERE id = 5 AND shop_id = 1 → null → "Product not found" 🛑
        ↓
  404 { success: false, message: "Product not found" }
  Zaytoon owner can't delete Electronics product! 🔒
*/