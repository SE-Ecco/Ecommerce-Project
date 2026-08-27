import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { updateShopSettingsValidation } from '../validations/shop-settings.validation';
import * as shopSettingsController from '../controllers/shop-settings.controller';
import { authorize } from '../middleware/role.middleware'
const router = Router();

router.get('/', authenticate, shopMiddleware, shopSettingsController.getShopSettings);
router.patch('/', authenticate, authorize('shop_admin'), shopMiddleware, updateShopSettingsValidation, validateMiddleware, shopSettingsController.updateShopSettings)

export default router;
