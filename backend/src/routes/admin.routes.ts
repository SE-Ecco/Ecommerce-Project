// WHAT: Maps super admin URLs — ALL require super_admin role
// IMPORTS: admin.controller, auth.middleware, role.middleware
// REGISTERED IN: app.ts as /api/admin
// ROUTES:
//   GET   /api/admin/shops             → getAllShops()
//   POST  /api/admin/shops             → createShop()
//   PATCH /api/admin/shops/:id         → toggleShopStatus()
//   GET   /api/admin/users             → getAllUsers()
//   PATCH /api/admin/users/:id/role    → changeUserRole()
//   DELETE /api/admin/users/:id        → deleteUser()

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.get('/shops', authenticate, authorize('super_admin'), adminController.getAllShops);

router.patch('/shops/:id/status', authenticate, authorize('super_admin'), adminController.updateShopStatus);

router.get('/users', authenticate, authorize('super_admin'), adminController.getAllUsers);


// New routes after updates.

router.patch('/users/:id/role', authenticate, authorize('super_admin'), adminController.changeUserRole);
router.delete('/users/:id', authenticate, authorize('super_admin'), adminController.deleteUser);

export default router;