// WHAT: API calls for products
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/shop/ProductsPage, pages/shop/ProductDetailPage, pages/owner/OwnerProducts
// ENDPOINTS: GET /api/shops/:slug/products, GET /api/products/:id, POST/PUT/DELETE /api/products

import api from './api'
import { Product } from '../types'

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products')
  return response.data.data
}

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`)
  return response.data.data
}

export const createProduct = async (data: FormData): Promise<Product> => {
  const response = await api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data.data
}

export const updateProduct = async (id: number, data: object): Promise<Product> => {
  const response = await api.put(`/products/${id}`, data)
  return response.data.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`)
}

export const getProductVariants = async (id: number) => {
  const response = await api.get(`/products/${id}/variants`)
  return response.data.data
}

export const getProductImages = async (id: number) => {
  const response = await api.get(`/products/${id}/images`)
  return response.data.data
}

export const addProductImage = async (id: number, data: FormData) => {
  const response = await api.post(`/products/${id}/images`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data.data
}

export const getActiveFlashSale = async (id: number) => {
  const response = await api.get(`/products/${id}/flash-sale`)
  return response.data.data
}

export const logProductView = async (id: number): Promise<void> => {
  await api.post(`/products/${id}/views`)
}

export const logSearch = async (query: string, results_count: number): Promise<void> => {
  await api.post('/products/search-log', { query, results_count })
}