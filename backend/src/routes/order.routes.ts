// WHAT: Maps order URLs to middleware + controller
// IMPORTS: order.controller, auth.middleware, shop.middleware, validate.middleware, order.validation
// REGISTERED IN: app.ts as /api/orders
// ROUTES:
//   POST   /api/orders              → [auth, validate]              → placeOrder()
//   GET    /api/orders/my-orders    → [auth]                        → getMyOrders()
//   GET    /api/orders/shop-orders  → [auth, shopMiddleware]        → getShopOrders()
//   PATCH  /api/orders/:id/status   → [auth, shopMiddleware, validate] → updateStatus()

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { 
        placeOrderValidation,
        updateStatusValidation,
        createPaymentTransactionValidation,
        updatePaymentStatusValidation } from '../validations/order.validation';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.post('/', authenticate, placeOrderValidation, validateMiddleware, orderController.placeOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/shop-orders', authenticate, shopMiddleware, orderController.getShopOrders);
router.patch('/:id/status', authenticate, shopMiddleware, updateStatusValidation, validateMiddleware, orderController.updateStatus);

router.post('/:id/payments', authenticate, shopMiddleware, createPaymentTransactionValidation, validateMiddleware, orderController.createPaymentTransactionHandler)
router.patch('/payments/:transactionId', authenticate, shopMiddleware, updatePaymentStatusValidation, validateMiddleware, orderController.updatePaymentStatusHandler)

export default router;
