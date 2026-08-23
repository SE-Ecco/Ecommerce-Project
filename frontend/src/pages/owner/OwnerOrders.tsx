// WHAT: Shop admin views + updates orders for their shop only
// IMPORTS: services/orderService, hooks/useAuth, components/order/OrderCard, OrderStatus
// PROTECTED: role = shop_admin only
// ACTIONS: Update status (pending → confirmed → shipped → delivered / cancelled)

import { useEffect, useState } from 'react'
import { getShopOrders, updateOrderStatus } from '../../services/orderService'
import { Order } from '../../types'
import OrderCard from '../../components/order/OrderCard'
import Spinner from '../../components/common/Spinner'

const STATUS_OPTIONS: Order['status'][] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const OwnerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getShopOrders()
        setOrders(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load orders.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id)
    try {
      const updated = await updateOrderStatus(id, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? updated : o))
      )
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id} className="mb-2">
              <OrderCard order={order} />
              <div className="flex items-center gap-2 mt-[-8px] mb-4 ml-2">
                <label className="text-sm text-gray-500">Update status:</label>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerOrders