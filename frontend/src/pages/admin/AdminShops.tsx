// WHAT: Super admin manages all shops — activate/deactivate, create new shops
// IMPORTS: services/shopService
// PROTECTED: role = super_admin only
// WHAT: Super admin manages all shops — view, activate, deactivate
// IMPORTS: shopService, Spinner
// PROTECTED: role = super_admin only

import { useEffect, useState } from 'react'
import { getShops } from '../../services/shopService'
import { updateShopStatus } from '../../services/adminService'
import { Shop } from '../../types'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const AdminShops = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getShops()
        setShops(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load shops.')
      } finally {
        setLoading(false)
      }
    }
    fetchShops()
  }, [])

  const handleToggleStatus = async (shop: Shop) => {
    setUpdatingId(shop.id)
    try {
      const newStatus = shop.status === 'active' ? 'inactive' : 'active'
      await updateShopStatus(shop.id, newStatus)
      setShops((prev) =>
        prev.map((s) => (s.id === shop.id ? { ...s, status: newStatus } : s))
      )
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update shop status.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner />
    </div>
  )

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">All Shops</h1>

      {shops.length === 0 ? (
        <p className="text-gray-500">No shops found.</p>
      ) : (
        <div className="space-y-3">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="border rounded-lg p-4 bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{shop.name}</p>
                <p className="text-sm text-gray-500">{shop.slug}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                  shop.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {shop.status}
                </span>
              </div>
              <Button
                variant="outlined"
                color={shop.status === 'active' ? 'error' : 'success'}
                disabled={updatingId === shop.id}
                onClick={() => handleToggleStatus(shop)}
              >
                {updatingId === shop.id
                  ? 'Updating...'
                  : shop.status === 'active'
                  ? 'Deactivate'
                  : 'Activate'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminShops