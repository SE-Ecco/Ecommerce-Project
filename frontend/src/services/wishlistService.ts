// WHAT: API calls for wishlist
// IMPORTS: services/api.ts
// USED BY: WishlistPage, ProductDetailPage
import api from './api'

// GET /api/wishlists — get all wishlists with items
export const getWishlist = async () => {
  const response = await api.get('/wishlists')
  return response.data.data
}

// POST /api/wishlists — create wishlist
export const createWishlist = async (name: string) => {
  const response = await api.post('/wishlists', { name })
  return response.data.data
}

// POST /api/wishlists/:id/items — add item to wishlist
export const addToWishlist = async (wishlistId: number, productId: number) => {
  const response = await api.post(`/wishlists/${wishlistId}/items`, { product_id: productId })
  return response.data.data
}

// DELETE /api/wishlists/:id/items — remove item from wishlist
export const removeFromWishlist = async (wishlistId: number, productId: number) => {
  const response = await api.delete(`/wishlists/${wishlistId}/items`, { data: { product_id: productId } })
  return response.data.data
}

// DELETE /api/wishlists/:id — delete entire wishlist
export const deleteWishlist = async (id: number): Promise<void> => {
  await api.delete(`/wishlists/${id}`)
}