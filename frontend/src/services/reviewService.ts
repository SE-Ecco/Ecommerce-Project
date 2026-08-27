// WHAT: API calls for reviews
// IMPORTS: services/api.ts
// USED BY: ProductDetailPage, ProductReviews component

import api from './api'

export const getReviews = async (productId: number) => {
  const response = await api.get(`/reviews/product/${productId}`)
  return response.data.data
}

export const createReview = async (data: {
  product_id: number
  rating: number
  comment?: string
  orderId?: number
}) => {
  const response = await api.post('/reviews', data)
  return response.data.data
}