// WHAT: API calls for admin actions
// IMPORTS: services/api.ts
// USED BY: AdminShops, AdminUsers

import api from './api'

export const updateShopStatus = async (id: number, status: string) => {
  const response = await api.patch(`/admin/shops/${id}/status`, { is_active: status === 'active' })
  return response.data.data
}