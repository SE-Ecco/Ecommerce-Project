// WHAT: API calls for shop settings
// IMPORTS: services/api.ts
// USED BY: OwnerSettings

import api from './api'

export const getShopSettings = async () => {
  const response = await api.get('/shop-settings')
  return response.data.data
}

export const updateShopSettings = async (data: {
  currency?: string
  language?: string
  theme_color?: string
  meta_title?: string
  meta_desc?: string
}) => {
  const response = await api.patch('/shop-settings', data)
  return response.data.data
}