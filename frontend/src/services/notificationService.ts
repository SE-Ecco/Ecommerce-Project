// WHAT: API calls for notifications
// IMPORTS: services/api.ts
// USED BY: hooks/useNotifications.ts, Navbar

import api from './api'

export const getNotifications = async () => {
  const response = await api.get('/notifications/my-notifications')
  return response.data.data
}

export const markAsRead = async (id: number) => {
  const response = await api.patch(`/notifications/${id}/read`)
  return response.data.data
}

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`)
}