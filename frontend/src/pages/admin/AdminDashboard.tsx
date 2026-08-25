// WHAT: Super admin overview of entire platform — total shops, users, orders
// IMPORTS: services/shopService, services/userService
// PROTECTED: role = super_admin only


import { useEffect, useState } from 'react'
import * as shopService from '../../services/shopService'
import * as userService from '../../services/userService'
import Spinner from '../../components/common/Spinner'

const AdminDashboard = () => {
  const [shops, setShops] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsData, usersData] = await Promise.all([
          shopService.getShops(),
          userService.getAllUsers(),
        ])
        setShops(shopsData)
        setUsers(usersData)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const activeShops = shops.filter((s) => s.status === 'active').length
  const inactiveShops = shops.filter((s) => s.status !== 'active').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Total Shops</p>
          <p className="text-3xl font-bold mt-2">{shops.length}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Active Shops</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{activeShops}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Inactive Shops</p>
          <p className="text-3xl font-bold mt-2 text-red-600">{inactiveShops}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard