// WHAT: Handles HTTP requests for orders
// IMPORTS: services/order.service.ts, utils/response.ts
// USED BY: routes/order.routes.ts
// HANDLES: POST place order, GET my orders, GET shop orders, PATCH update status

// IMPORTS: services/order.service.ts, utils/response.ts
// USED BY: routes/order.routes.ts
// HANDLES: POST place order, GET my orders, GET shop orders, PATCH update status

import { Request, Response, NextFunction } from 'express'; // 🔧 added NextFunction
import * as orderService from '../services/order.service';
import { successResponse, errorResponse } from '../utils/response';

// ── PLACE ORDER ──────────────────────────────────────────────
export const placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const shopId = req.user?.shop_id;

        if (!userId || !shopId) {
            throw new Error('User Id and Shop Id are required');
        }

        const { items, address_id, notes } = req.body;
        const order = await orderService.placeOrder(
            userId, shopId, items,
            address_id ?? null,
            notes ?? null
        );
        res.status(201).json(successResponse(order));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

// ── GET MY ORDERS ────────────────────────────────────────────
export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new Error('User ID is required');
        const orders = await orderService.getMyOrders(userId);
        res.status(200).json(successResponse(orders));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

// ── GET SHOP ORDERS ──────────────────────────────────────────
export const getShopOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const shopId = req.user?.shop_id;
        if (!shopId) throw new Error('shop ID is required');
        const orders = await orderService.getShopOrders(shopId);
        res.status(200).json(successResponse(orders));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

// ── UPDATE ORDER STATUS ──────────────────────────────────────
export const updateStatus = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderId = Number(req.params.id);
        const shopId = req.user?.shop_id;
        const { status } = req.body;

        if (!shopId) throw new Error('Shop ID is required');
        if (!orderId || isNaN(orderId)) throw new Error('Valid order ID is required');

        const order = await orderService.updateStatus(orderId, shopId, status);
        res.status(200).json(successResponse(order));
    } catch (error) {
        next(error); // 🔧 fix
    }
};

// ── PAYMENT TRANSACTION ──────────────────────────────────────
export const createPaymentTransactionHandler = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const orderId = Number(req.params.id);
        const shop_id = req.user!.shop_id as number;
        const { amount, paymentMethod } = req.body;
        const transaction = await orderService.createPaymentTransaction(
            orderId, shop_id, amount, paymentMethod
        );
        res.status(201).json(successResponse(transaction));
    } catch (error) {
        next(error);
    }
};

export const updatePaymentStatusHandler = async (
    req: Request<{ transactionId: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const transactionId = Number(req.params.transactionId);
        const shop_id = req.user!.shop_id as number;
        const { status, transactionRef } = req.body;
        const transaction = await orderService.updatePaymentStatus(
            transactionId, shop_id, status,
            transactionRef ?? null
        );
        res.status(200).json(successResponse(transaction));
    } catch (error) {
        next(error);
    }
};

// ── 🍽️ THE STORY ─────────────────────────────────────────
// order.controller.ts = the CASHIER 💼
// customer/owner tells the cashier what they want (req)
// cashier checks their ID badge is really attached (req.user? guard)
// cashier passes the exact order to the chef (orderService)
// chef cooks (service.ts does the real work)
// cashier wraps the plate in the SAME standard box every time (successResponse)
// if the chef drops the pan → cashier just calls the manager (next(error)),
//   doesn't try to clean it up themselves


