import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { shopMiddleware } from '../middleware/shop.middleware';
import * as shopSettingsController from '../controllers/shop-settings.controller';

const router = Router();

router.get('/', authenticate, shopMiddleware, shopSettingsController.getShopSettings);

router.patch('/', authenticate, shopMiddleware, shopSettingsController.updateShopSettings);

export default router;
