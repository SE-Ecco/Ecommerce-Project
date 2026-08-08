import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { createShippingMethodValidation, updateShippingMethodValidation } from '../validations/shipping.validation';
import * as shippingController from '../controllers/shipping.controller';

const router = Router();

router.get('/', authenticate, shopMiddleware, shippingController.getShippingMethods);
router.post('/', authenticate, shopMiddleware, createShippingMethodValidation, validateMiddleware, shippingController.createShippingMethod);
router.put('/:id', authenticate, shopMiddleware, updateShippingMethodValidation, validateMiddleware, shippingController.updateShippingMethod);
router.delete('/:id', authenticate, shopMiddleware, shippingController.deleteShippingMethod);

export default router;