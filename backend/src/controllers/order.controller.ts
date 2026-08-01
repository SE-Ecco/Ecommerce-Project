// WHAT: Handles HTTP requests for orders
// IMPORTS: services/order.service.ts, utils/response.ts
// USED BY: routes/order.routes.ts
// HANDLES: POST place order, GET my orders, GET shop orders, PATCH update status

import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { successResponse } from '@/utils/response';

// ── PLACE ORDER ──────────────────────────────────────────────
// POST /api/orders
export const placeOrder = async (
    req: Request,       // WHY: carries everything the client sent — params, body, and req.user (from auth.middleware)
    res: Response,       // WHY: needed to actually send the reply back to the client
    next: NextFunction   // WHY: needed to forward errors to error.middleware — controller never handles errors itself
) => {
    try {
        const userId = req.user?.id;        // WHY: from JWT (trusted), NEVER from req.body
        const tenantId = req.user?.shop_id; // WHY: which shop this order is for (trusted, from token)

        // WHY: defensive check — auth.middleware SHOULD guarantee these exist,
        // but this protects against middleware bugs + narrows TS type to `number`
        if (!userId || !tenantId) {
            throw new Error('User Id and Shop Id are required');
        }

        const { items, address_id, notes } = req.body; // WHY: WHAT they're ordering — safe to trust from client

        const order = await orderService.placeOrder(
            userId,              // WHY passed: service needs to know WHO is ordering
            tenantId,            // WHY passed: service needs to know WHICH shop, to validate products belong to it
            items,               // WHY passed: service needs WHAT to actually create as OrderItems
            address_id ?? null,  // WHY passed + ??: optional — pickup orders have no address
            notes ?? null        // WHY passed + ??: optional — most orders have no special note
        );

        res.status(201).json(successResponse(order)); // WHY 201: this is a CREATE action
    } catch (error) {
        next(error); // WHY: forward to error.middleware, controller never builds error responses itself
    }
};

// ── GET MY ORDERS ────────────────────────────────────────────
// GET /api/orders/my-orders
export const getMyOrders = async (
    req: Request,       // WHY: needed to read req.user (who is asking)
    res: Response,       // WHY: needed to send back their order list
    next: NextFunction   // WHY: forwards any DB/service errors to error.middleware
) => {
    try {
        const userId = req.user?.id; // WHY: only fetch orders belonging to the LOGGED-IN user

        if (!userId) {
            throw new Error('User ID is required'); // WHY: same defensive guard as above
        }

        const orders = await orderService.getMyOrders(userId); // WHY passed: service needs to know WHOSE orders to fetch

        res.status(200).json(successResponse(orders)); // WHY 200: this is a READ action, not a create
    } catch (error) {
        next(error);
    }
};

// ── GET SHOP ORDERS ──────────────────────────────────────────
// GET /api/orders/shop-orders
export const getShopOrders = async (
    req: Request,       // WHY: needed to read req.user.shop_id (which shop is asking)
    res: Response,       // WHY: needed to send back the shop's order list
    next: NextFunction   // WHY: forwards errors to error.middleware
) => {
    try {
        const tenantId = req.user?.shop_id; // WHY: shop owner sees ONLY their own shop's orders

        if (!tenantId) {
            throw new Error('shop ID is required');
        }

        const orders = await orderService.getShopOrders(tenantId); // WHY passed: service needs to know WHICH shop's orders to fetch
        res.status(200).json(successResponse(orders));
    } catch (error) {
        next(error);
    }
};

// ── UPDATE ORDER STATUS ──────────────────────────────────────
// PATCH /api/orders/:id/status
export const updateStatus = async (
    req: Request,       // WHY: carries :id in params, new status in body, and req.user for security check
    res: Response,       // WHY: needed to send back the updated order
    next: NextFunction   // WHY: forwards errors to error.middleware
) => {
    try {
        const orderId = Number(req.params.id);  // WHY: which order — comes from the URL, not body
        const tenantId = req.user?.shop_id;      // WHY: security — proves this shop actually owns the order
        const { status } = req.body;              // WHY: new status value — sent by shop owner

        if (!tenantId) {
            throw new Error('Shop ID is required');
        }

        if (!orderId || isNaN(orderId)) {
            throw new Error('Valid order ID is required'); // WHY: guards against bad/non-numeric :id in URL
        }

        const order = await orderService.updateStatus(
            orderId,   // WHY passed: service needs to know WHICH order to update
            tenantId,  // WHY passed: service uses this to verify the order belongs to THIS shop (security)
            status     // WHY passed: service needs the NEW status value to save
        );
        res.status(200).json(successResponse(order));
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