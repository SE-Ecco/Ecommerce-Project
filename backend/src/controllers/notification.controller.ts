// WHAT: Handles HTTP requests for notifications
// IMPORTS: services/notification.service.ts, utils/response.ts
// USED BY: routes/notification.routes.ts
// HANDLES: GET my notifications, PATCH mark as read, DELETE notification

import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { successResponse, errorResponse } from '../utils/response';

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json(errorResponse('User ID is required'));
            return;
        }

        const notifications = await notificationService.getMyNotifications(userId);
        res.status(200).json(successResponse(notifications));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
};

export const markAsRead = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const notificationId = Number(req.params.id);
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json(errorResponse('User ID is required'));
            return;
        }
        if (!notificationId || isNaN(notificationId)) {
            res.status(400).json(errorResponse('Valid notification ID is required'));
            return;
        }

        const notification = await notificationService.markAsRead(notificationId, userId);
        res.status(200).json(successResponse(notification));
    } catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
};

export const deleteNotification = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const notificationId = Number(req.params.id);
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json(errorResponse('User ID is required'));
            return;
        }
        if (!notificationId || isNaN(notificationId)) {
            res.status(400).json(errorResponse('Valid notification ID is required'));
            return;
        }

        const result = await notificationService.deleteNotification(notificationId, userId);
        res.status(200).json(successResponse(result));
    } catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
};
