// WHAT: Handles HTTP requests for super admin actions
// IMPORTS: services/shop.service.ts, models/User.ts, utils/response.ts
// USED BY: routes/admin.routes.ts
// HANDLES: Create shop + assign shop_admin, activate/deactivate shop, list/manage all users
// PROTECTED: super_admin role only

import { Request, Response, NextFunction } from 'express';
import * as shopService from '../services/shop.service';
import User from '../models/User';
import { successResponse, errorResponse } from '../utils/response';

export const getAllShops = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const shops = await shopService.getShopsList();
        res.status(200).json(successResponse(shops));
    } catch (error){
        res.status(500).json(errorResponse((error as Error).message));
    }
};

// ── UPDATE SHOP STATUS ───────────────────────────────────────
// PATCH /api/admin/shops/:id/status

export const updateShopStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const shopId = Number(req.params.id);
        const { is_active } = req.body;

        if(!shopId || isNaN(shopId)) {
            throw new Error('Invalid shop ID');
        }

        const shop = await shopService.updateShopStatus(shopId, is_active);
        res.status(200).json(successResponse(shop));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

// ── GET ALL USERS ───────────────────────────────────────────────────

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.findAll();

        res.status(200).json(successResponse(users));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

// ── CREATE SHOP + ASSIGN ADMIN ────────────────────────────────
export const createShop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {name, slug, is_active, adminUserId} = req.body;

        if(!name || !slug || !adminUserId) {
            return res.status(400).json(errorResponse('Missing required fields: name, slug, adminUserId'));
        }

        const newShop = await shopService.createShop(
            {name, slug, is_active},
            adminUserId
        );
        res.status(201).json(successResponse(newShop));
    } catch(error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};


// after talking with Ai said create those functions in the admin controller to handle the new routes for user management. Here are the functions:
// ── CHANGE USER ROLE ───────────────────────────────────────────────
// PATCH /api/admin/users/:id/role  
export const changeUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const userId = Number(req.params.id);
        const { role } = req.body;

        if(!userId || isNaN(userId)) {
            return res.status(400).json(errorResponse('Invalid user ID'));
        }

        if(!role || !['super_admin', 'shop_admin', 'customer'].includes(role)) {
            return res.status(400).json(errorResponse('Invalid role. Must be one of: super_admin, shop_admin, customer'));
        }

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json(errorResponse('User not found'));
        }

        user.set('role', role);
        await user.save();

        res.status(200).json(successResponse(user));
    } catch(error){
        res.status(500).json(errorResponse((error as Error).message));
    }
};

// ── DELETE USER ───────────────────────────────────────────────
// DELETE /api/admin/users/:id

export const deleteUser = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const userId = Number(req.params.id);
        
        if(!userId || isNaN(userId)){
            return res.status(400).json(errorResponse('Invalid user ID'));
        }

        const user = await User.findByPk(userId);

        if(!user){
            return res.status(404).json(errorResponse('User not found'));
        }

        await user.destroy();
        res.status(200).json(successResponse({ message: 'User deleted successfully' }));
    } catch(error){
        res.status(500).json(errorResponse((error as Error).message));
    }
};