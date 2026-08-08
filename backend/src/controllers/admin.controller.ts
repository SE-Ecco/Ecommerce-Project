import { Request, Response, NextFunction } from 'express';
import * as shopService from '../services/shop.service';
import User from '../models/User';
import { successResponse, errorResponse } from '../utils/response';

export const getAllShops = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const shops = await shopService.getShopsList();
        res.status(200).json(successResponse(shops));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

export const updateShopStatus = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const shopId = Number(req.params.id);
        const { is_active } = req.body;
        if (!shopId || isNaN(shopId)) throw new Error('Invalid shop ID');
        const shop = await shopService.updateShopStatus(shopId, is_active);
        res.status(200).json(successResponse(shop));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

export const getAllUsers = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // 🔧 never expose passwords!
        });
        res.status(200).json(successResponse(users));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

export const createShop = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const { name, slug, is_active, adminUserId } = req.body;
        if (!name || !slug || !adminUserId) {
            res.status(400).json(errorResponse('Missing required fields: name, slug, adminUserId'));
            return;
        }
        const newShop = await shopService.createShop({ name, slug, is_active }, adminUserId);
        res.status(201).json(successResponse(newShop));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

export const changeUserRole = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        const { role } = req.body;
        if (!userId || isNaN(userId)) {
            res.status(400).json(errorResponse('Invalid user ID'));
            return;
        }
        if (!role || !['super_admin', 'shop_admin', 'customer'].includes(role)) {
            res.status(400).json(errorResponse('Invalid role. Must be one of: super_admin, shop_admin, customer'));
            return;
        }
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json(errorResponse('User not found'));
            return;
        }
        user.set('role', role);
        await user.save();
        res.status(200).json(successResponse(user));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

export const deleteUser = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        if (!userId || isNaN(userId)) {
            res.status(400).json(errorResponse('Invalid user ID'));
            return;
        }
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json(errorResponse('User not found'));
            return;
        }
        await user.destroy();
        res.status(200).json(successResponse({ message: 'User deleted successfully' }));
    } catch (error) {
        next(error); // 🔧 fix
    }
};