// WHAT: Shop admin home — stats: total orders, pending orders, total revenue
// IMPORTS: hooks/useAuth, services/orderService
// PROTECTED: role = shop_admin only

import { useEffect, useState } from 'react'
import { getShopOrders } from '../../services/orderService'
import { Order } from '../../types'
import Spinner from '../../components/common/Spinner'
import OrderStatus from '../../components/order/OrderStatus'

const OwnerDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getShopOrders()
        setOrders(data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message || 'Could not load dashboard data.'
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

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">
            {totalRevenue.toLocaleString()} IQD
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* recent orders */}
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {recentOrders.map((order) => (
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

export default OwnerDashboard
