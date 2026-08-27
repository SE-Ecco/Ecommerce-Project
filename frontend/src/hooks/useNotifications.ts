// WHAT: Bridges notificationService (backend calls) and notificationStore (local state) — fetch, mark as read, delete
// IMPORTS: store/notificationStore, services/notificationService (getNotifications, markAsRead, deleteNotification)
// USED BY: Navbar.tsx (bell icon + badge), a notifications dropdown/page

import { useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { getNotifications, markAsRead as markAsReadService, deleteNotification } from '../services/notificationService';

export function useNotifications() {
  const { items, unreadCount, setNotifications, markAsRead: markAsReadStore, removeNotification: removeNotificationStore } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await markAsReadService(id);
      markAsReadStore(id);
    } catch {
      setError('Failed to mark notification as read');
    }
  };

  const removeNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      removeNotificationStore(id);
    } catch {
      setError('Failed to delete notification');
    }
  };

  return { items, unreadCount, loading, error, fetchNotifications, markAsRead, removeNotification };
}
// NOTES:
// → useNotificationStore (store/notificationStore) — pulls read state (items,
//   unreadCount) plus the store's own update functions. Those are renamed on
//   import (markAsReadStore, removeNotificationStore) to avoid clashing with this
//   hook's own function names of the same purpose.
//
// → getNotifications, markAsRead (renamed markAsReadService), deleteNotification
//   (services/notificationService) — the real backend calls, built by a teammate.
//   This hook is the ONLY place that coordinates calling these AND updating the
//   store — components never call the service directly.
//
// → loading, error (useState) — local to this hook, same pattern as useProducts.
//   Only used around fetchNotifications (the big list fetch) — markAsRead and
//   removeNotification skip loading since they're small, instant single-item
//   actions, not full-page fetches.
//
// → fetchNotifications() — standard try/catch/finally: calls the service, and on
//   success hands the full list to setNotifications() in the store, which also
//   recalculates unreadCount internally. Meant to run once when a component using
//   notifications mounts (e.g. inside a useEffect in Navbar or a notifications page).
//
// → markAsRead(id) — service call FIRST (markAsReadService, the real PATCH
//   request), store update SECOND (markAsReadStore), only if the service call
//   succeeds. This guarantees the store never claims something is read when the
//   backend doesn't actually agree — same reasoning as useAuth's register()
//   wrapping service + store together as one trusted unit.
//
// → removeNotification(id) — identical service-first, store-after pattern, but
//   for the DELETE endpoint.
//
// → return { ... } — hands components everything needed: the synced data
//   (items, unreadCount), status flags for the fetch (loading, error), and all
//   three actions. Components (Navbar, a notifications page) only ever talk to
//   this hook — never to notificationService or notificationStore directly.

/** STORY
 * If notificationStore is the signboard and notificationService is the actual news
 * source, useNotifications is the messenger running between them. It walks to the
 * backend, confirms the news is real, THEN pins it to the signboard — never the
 * other way around. That way, anyone glancing at the signboard (Navbar's bell icon,
 * a notifications page) always sees something the backend actually agrees with.
 */