/*
    What: Business Logic for Notification Service
        -> Create,
        -> List,
        -> Mark as Read,
        -> Delete Notifications
    Imports: models/notification.ts
    Used By: controllers/notification.controller.ts
*/

import Notification from '../models/Notification';

export const createNotification = async (
    userId: number,
    shopId: number,
    type: string,
    title: string,
    body: string,
    data?: object
) => {
    return await Notification.create(
        {
            user_id: userId,
            shop_id: shopId,
            type,
            title,
            body,
            data,
        }
    );
};

export const getMyNotifications = async (userId: number) => {
    return await Notification.findAll(
        {
            where: {
                user_id: userId,
            },
            order: [['id', 'DESC']], // newest first
        }
    )
}

export const markAsRead = async (
    notificationId: number,
    userId: number
) => {
    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            user_id: userId,
        },
    });

    if (!notification) {
        throw new Error('Notification not found or does not belong to user');
    }


    notification.set('is_read', true);
    await notification.save();

    return notification;
};