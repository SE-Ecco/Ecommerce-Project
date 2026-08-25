// WHAT: Global notification state — holds fetched notifications + unread count, no API calls (services deferred)
// IMPORTS: zustand, types/index.ts (Notification)
// USED BY: hooks/useNotifications.ts

import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: number) => void;
  removeNotification: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    const unread = notifications.filter((n) => !n.is_read).length;
    set({ items: notifications, unreadCount: unread });
  },

  markAsRead: (id) => {
    const updated = get().items.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    const unread = updated.filter((n) => !n.is_read).length;
    set({ items: updated, unreadCount: unread });
  },

  removeNotification: (id) => {
    const updated = get().items.filter((n) => n.id !== id);
    const unread = updated.filter((n) => !n.is_read).length;
    set({ items: updated, unreadCount: unread });
  },
}));

// NOTES:
// → create (zustand) — NOT wrapped in persist middleware this time, unlike cartStore
//   and wishlistStore. Notifications should always reflect the backend's current
//   state, not stale localStorage data from a previous session — same reasoning as
//   shopStore having no persist.
//
// → Notification (types) — matches the real backend Sequelize model exactly:
//   id, user_id, shop_id, type, title, body, is_read, data, created_at. Nothing
//   guessed — this came directly from the actual Notification model file.
//
// → items: [] — starts empty. This store does NOT fetch data itself (no API calls
//   live in a store) — it only holds whatever useNotifications hands it after
//   calling notificationService.getNotifications().
//
// → unreadCount: 0 — kept as its own tracked field instead of recalculating
//   items.filter(...).length every time a component renders. Navbar's bell badge
//   can just read this number directly.
//
// → setNotifications(notifications) — called once after the service fetches the
//   full list from the backend. Recalculates unreadCount fresh from the incoming
//   data so items and unreadCount never drift out of sync with each other.
//
// → markAsRead(id) — local-only state update (flips is_read for one notification).
//   This runs AFTER useNotifications successfully calls
//   notificationService.markAsRead(id) on the backend — the store never talks to
//   the backend itself, it just mirrors the result.
//
// → removeNotification(id) — same pattern as markAsRead: local removal only, meant
//   to run after the service's deleteNotification(id) call succeeds on the backend.
//
// → all three actions (setNotifications/markAsRead/removeNotification) recalculate
//   unreadCount every time, so the Navbar