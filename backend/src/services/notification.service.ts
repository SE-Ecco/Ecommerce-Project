/*
    WHAT: Business logic for notifications
      -> Create, List, Mark as Read, Delete
    IMPORTS: models/Notification.ts
    USED BY: controllers/notification.controller.ts
    NOTE: createNotification is called INTERNALLY by other services
          (e.g. order.service.ts when an order ships) — not exposed
          as its own HTTP route, since customers never "create" their
          own notifications
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
    return await Notification.create({
        user_id: userId,
        shop_id: shopId,
        type,
        title,
        body,
        data,
    });
};

export const getMyNotifications = async (userId: number, shopId?: number) => {
    return await Notification.findAll({
        where: shopId ? { user_id: userId, shop_id: shopId } : { user_id: userId },
        order: [['id', 'DESC']],
    });
};

export const markAsRead = async (notificationId: number, userId: number) => {
    const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
        throw new Error('Notification not found or does not belong to user');
    }

    notification.set('is_read', true);
    await notification.save();
    return notification;
};

export const deleteNotification = async (notificationId: number, userId: number) => {
    const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
        throw new Error('Notification not found or does not belong to user');
    }

    await notification.destroy();
    return { message: 'Notification deleted successfully' };
};
