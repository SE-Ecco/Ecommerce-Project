// WHAT: API calls for shops (tenants)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/shop/HomePage, pages/admin/AdminShops, pages/owner/OwnerProfile
// ENDPOINTS: GET /api/shops, GET /api/shops/slug/:slug, POST/PATCH /api/admin/shops

import api from './api'
import { Shop } from '../types'

export const getShops = async (): Promise<Shop[]> => {
  const response = await api.get('/shops')
  return response.data.data
}

export const getShopById = async (id: number): Promise<Shop> => {
  const response = await api.get(`/shops/${id}`)
  return response.data.data
}