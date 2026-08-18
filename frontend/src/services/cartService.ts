// WHAT: API calls for cart
// IMPORTS: services/api.ts
// USED BY: hooks/useCart.ts, CartPage

import api from './api'

export const getCart = async () => {
  const response = await api.get('/cart')
  return response.data.data
}

export const addToCart = async (data: {
  product_id: number
  quantity: number
  variant_id?: number
}) => {
  const response = await api.post('/cart', data)
  return response.data.data
}

export const updateCartItem = async (id: number, quantity: number) => {
  const response = await api.put(`/cart/${id}`, { quantity })
  return response.data.data
}

export const removeCartItem = async (id: number): Promise<void> => {
  await api.delete(`/cart/${id}`)
}