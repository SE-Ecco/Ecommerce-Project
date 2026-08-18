// WHAT: API calls for addresses
// IMPORTS: services/api.ts
// USED BY: AddressPage, CheckoutPage

import api from './api'

export const getAddresses = async () => {
  const response = await api.get('/addresses')
  return response.data.data
}

export const createAddress = async (data: {
  label: string
  street: string
  city: string
  phone: string
}) => {
  const response = await api.post('/addresses', data)
  return response.data.data
}

export const updateAddress = async (id: number, data: object) => {
  const response = await api.put(`/addresses/${id}`, data)
  return response.data.data
}

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`)
}