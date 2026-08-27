import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { successResponse, errorResponse } from '../utils/response';

export const createWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const { name } = req.body;

        const wishlist = await wishlistService.createWishlist(user_id, shop_id, name);
        res.status(201).json(successResponse(wishlist));
    } catch (error) {
        next(error);
    }
};

export const getWishlists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const wishlists = await wishlistService.getWishlists(user_id, shop_id);
        res.status(200).json(successResponse(wishlists));
    } catch (error) {
        next(error);
    }
};

export const addItemToWishlist = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user_id = req.user!.id as number;
        const wishlist_id = Number(req.params.id);
        const { product_id } = req.body;

        const item = await wishlistService.addItemToWishlist(wishlist_id, user_id, product_id);
        res.status(201).json(successResponse(item));
    } catch (error) {
        next(error);
    }
};

export const removeItemFromWishlist = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const wishlist_id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const { product_id } = req.body;

        const result = await wishlistService.removeItemFromWishlist(wishlist_id, user_id, product_id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        next(error);
    }
};

export const deleteWishlist = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const wishlist = await wishlistService.deleteWishlist(id, user_id);
        res.status(200).json(successResponse(wishlist));
    }
    catch (error) {
        next(error);
    }
}