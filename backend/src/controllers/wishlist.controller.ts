import { Request, Response } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { successResponse, errorResponse } from '../utils/response';

export const createWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const { name } = req.body;

        const wishlist = await wishlistService.createWishlist(user_id, shop_id, name);
        res.status(201).json(successResponse(wishlist));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

export const getWishlists = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const wishlists = await wishlistService.getWishlists(user_id, shop_id);
        res.status(200).json(successResponse(wishlists));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

export const addItemToWishlist = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user_id = req.user!.id as number;
        const wishlist_id = Number(req.params.id);
        const { product_id } = req.body;

        const item = await wishlistService.addItemToWishlist(wishlist_id, user_id, product_id);
        res.status(201).json(successResponse(item));
    } catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
};

export const removeItemFromWishlist = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const wishlist_id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const { product_id } = req.body;

        const result = await wishlistService.removeItemFromWishlist(wishlist_id, user_id, product_id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
};

export const deleteWishlist = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const wishlist = await wishlistService.deleteWishlist(id, user_id);
        res.status(200).json(successResponse(wishlist));
    }
    catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
}