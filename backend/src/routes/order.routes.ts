// WHAT: Maps order URLs to middleware + controller
// IMPORTS: order.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/orders
// ROUTES:
//   POST  /api/orders              → [auth]                                    → placeOrder()
//   GET   /api/orders/my-orders    → [auth]                                    → getMyOrders()
//   GET   /api/orders/shop         → [auth, authorize('shop_admin'), attachShopId] → getShopOrders()
//   PATCH /api/orders/:id/status   → [auth, authorize('shop_admin'), attachShopId] → updateStatus()

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/', authenticate, orderController.placeOrder);

router.get('/my-orders', authenticate, orderController.getMyOrders);

router.get('/shop-orders', authenticate, shopMiddleware, orderController.getShopOrders);

router.patch('/:id/status', authenticate, shopMiddleware, orderController.updateStatus);
export default router;