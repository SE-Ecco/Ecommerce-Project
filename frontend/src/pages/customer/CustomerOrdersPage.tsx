// WHAT: Shows customer's order history
// IMPORTS: orderService, OrderStatus, Spinner
// FLOW: load my orders → display list with status badges

import { useEffect, useState } from 'react'
import { getMyOrders } from '../../services/orderService'
import { Order } from '../../types'
import Spinner from '../../components/common/Spinner'
import OrderStatus from '../../components/order/OrderStatus'

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load your orders.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="text-right">
                <OrderStatus status={order.status} /> {/* 🔧 fix */}
                <p className="font-bold mt-2">
                  {order.total_price.toLocaleString()} IQD
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerOrdersPage
