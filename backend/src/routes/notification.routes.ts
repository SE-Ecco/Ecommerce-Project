// WHAT: Maps notification URLs to middleware + controller
// IMPORTS: notification.controller, auth.middleware
// REGISTERED IN: app.ts as /api/notifications
// ROUTES:
//   GET   /api/notifications/my-notifications → getMyNotifications()
//   PATCH /api/notifications/:id/read         → markAsRead()

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.get('/my-notifications', authenticate, notificationController.getMyNotifications);

router.patch('/:id/read', authenticate, notificationController.markAsRead);

export default router;
