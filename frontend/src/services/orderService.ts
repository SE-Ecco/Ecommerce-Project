// WHAT: API calls for orders
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/checkout/CheckoutPage, pages/owner/OwnerOrders, pages/customer/CustomerOrdersPage
// ENDPOINTS: POST /api/orders, GET /api/orders/my-orders, GET /api/orders/shop, PATCH /api/orders/:id/status

import api from './api'
import { Order } from '../types'

export const placeOrder = async (data: {
  items: { product_id: number; quantity: number }[]
  address_id?: number
  notes?: string
}): Promise<Order> => {
  const response = await api.post('/orders', data)
  return response.data.data
}

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders/my-orders')
  return response.data.data
}

export const getShopOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders/shop-orders')
  return response.data.data
}

export const updateOrderStatus = async (
  id: number,
  status: string
): Promise<Order> => {
  const response = await api.patch(`/orders/${id}/status`, { status })
  return response.data.data
}

export const createPaymentTransaction = async (
  orderId: number,
  amount: number,
  paymentMethod: string
) => {
  const response = await api.post(`/orders/${orderId}/payments`, {
    amount,
    paymentMethod
  })
  return response.data.data
}