import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { updateShopSettingsValidation } from '../validations/shop-settings.validation';
import * as shopSettingsController from '../controllers/shop-settings.controller';

const router = Router();

router.get('/', authenticate, shopMiddleware, shopSettingsController.getShopSettings);
router.patch(
    '/',
    authenticate,
    shopMiddleware,
    updateShopSettingsValidation, // 🔧 fix: validation added
    validateMiddleware,
    shopSettingsController.updateShopSettings
);

export default router;
