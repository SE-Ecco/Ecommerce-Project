// WHAT: API calls for categories (per shop)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/owner/OwnerCategories, components/product/ProductForm (category dropdown)
// ENDPOINTS:
//   GET    /api/shops/:shopId/categories      → list categories for a shop
//   POST   /api/categories                    → create category (shop_admin)
//   PUT    /api/categories/:id                → update category (shop_admin)
//   DELETE /api/categories/:id                → delete category (shop_admin)
// WHAT: API calls for categories
// IMPORTS: services/api.ts
// USED BY: OwnerCategories, ProductForm

import api from './api'
import { Category } from '../types'

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories')
  return response.data.data
}

export const createCategory = async (data: { name: string }): Promise<Category> => {
  const response = await api.post('/categories', data)
  return response.data.data
}

export const updateCategory = async (id: number, data: { name: string }): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`)
}