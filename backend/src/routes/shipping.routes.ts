import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { createShippingMethodValidation, updateShippingMethodValidation } from '../validations/shipping.validation';
import * as shippingController from '../controllers/shipping.controller';
import { authorize } from '../middleware/role.middleware'
const router = Router();

router.get('/', authenticate, shopMiddleware, shippingController.getShippingMethods);
router.post('/', authenticate, authorize('shop_admin'), shopMiddleware, createShippingMethodValidation, validateMiddleware, shippingController.createShippingMethod)
router.put('/:id', authenticate, authorize('shop_admin'), shopMiddleware, updateShippingMethodValidation, validateMiddleware, shippingController.updateShippingMethod)
router.delete('/:id', authenticate, authorize('shop_admin'), shopMiddleware, shippingController.deleteShippingMethod)

export default router;