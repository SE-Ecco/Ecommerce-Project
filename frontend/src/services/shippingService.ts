// WHAT: API calls for shipping methods
// IMPORTS: services/api.ts
// USED BY: CheckoutPage, OwnerShipping

import api from './api'

export const getShippingMethods = async () => {
  const response = await api.get('/shipping')
  return response.data.data
}

export const createShippingMethod = async (data: {
  name: string
  price?: number
  min_days?: number
  max_days?: number
}) => {
  const response = await api.post('/shipping', data)
  return response.data.data
}

export const updateShippingMethod = async (id: number, data: object) => {
  const response = await api.put(`/shipping/${id}`, data)
  return response.data.data
}

export const deleteShippingMethod = async (id: number): Promise<void> => {
  await api.delete(`/shipping/${id}`)
}