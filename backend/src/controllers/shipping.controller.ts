import { Request, Response, NextFunction } from 'express';
import * as shippingService from '../services/shipping.service';
import { successResponse, errorResponse } from '../utils/response';

export const getShippingMethods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const methods = await shippingService.getShippingMethods(shop_id);
    res.status(200).json(successResponse(methods));
  } catch (error) { next(error); }
};

export const createShippingMethod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const method = await shippingService.createShippingMethod(shop_id, req.body);
    res.status(201).json(successResponse(method));
  } catch (error) { next(error); }
};

export const updateShippingMethod = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id);
    const method = await shippingService.updateShippingMethod(id, shop_id, req.body);
    res.status(200).json(successResponse(method));
  } catch (error) { next(error); }
};

export const deleteShippingMethod = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const id = Number(req.params.id);
    const result = await shippingService.deleteShippingMethod(id, shop_id);
    res.status(200).json(successResponse(result));
  } catch (error) { next(error); }
};