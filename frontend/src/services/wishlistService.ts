// WHAT: API calls for wishlist
// IMPORTS: services/api.ts
// USED BY: WishlistPage, ProductDetailPage

import api from './api'

export const getWishlist = async () => {
  const response = await api.get('/wishlists')
  return response.data.data
}

export const addToWishlist = async (product_id: number) => {
  const response = await api.post('/wishlists', { product_id })
  return response.data.data
}

export const removeFromWishlist = async (id: number): Promise<void> => {
  await api.delete(`/wishlists/${id}`)
}