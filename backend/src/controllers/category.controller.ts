// WHAT: Handles HTTP requests for categories (per shop)
// IMPORTS: services/category.service.ts, utils/response.ts
// USED BY: routes/category.routes.ts
// HANDLES: GET shop categories (public), POST create, PUT update, DELETE (shop_admin)
import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import { successResponse, errorResponse } from '../utils/response'

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const categories = await categoryService.getCategories(shop_id);
    res.json(successResponse(categories))
  }
  catch (error) {
    next(error)
  }
}

export const getCategoryById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id);
    const categories = await categoryService.getCategoryById(id, shop_id)
    res.json(successResponse(categories))
  }
  catch (error) {
    next(error)
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const category = await categoryService.createCategory(shop_id, req.body);
    res.status(201).json(successResponse(category));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id);
    const data = {
      ...req.body,
      ...(req.file && {
        cloudinary_banner_url: req.file.path,
        cloudinary_banner_public_id: req.file.filename,
      }),
    };
    const categories = await categoryService.updateCategory(shop_id, id, data);
    res.status(200).json(successResponse(categories));
  }
  catch (error) {
    next(error);
  }
}

export const deleteCategory = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id);
    const result = await categoryService.deleteCategory(id, shop_id);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};