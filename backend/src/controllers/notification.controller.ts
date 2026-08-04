// WHAT: Handles HTTP requests for notifications
// IMPORTS: services/notification.service.ts, utils/response.ts
// USED BY: routes/notification.routes.ts
// HANDLES: GET my notifications, PATCH mark as read

import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { successResponse, errorResponse } from '../utils/response';

// ── GET MY NOTIFICATIONS ──────────────────────────────────────

export const getMyNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json(errorResponse('User ID is required'));
        }

        const notifications = await notificationService.getMyNotifications(userId);

        res.status(200).json(successResponse(notifications));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

// ── MARK AS READ ───────────────────────────────────────────────
export const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const notificationId = Number(req.params.id);
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json(errorResponse('User ID is required'));
        }

        if (!notificationId || isNaN(notificationId)) {
            return res.status(400).json(errorResponse('Valid notification ID is required'));
        }

        const notification = await notificationService.markAsRead(notificationId, userId);

        res.status(200).json(successResponse(notification));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};
