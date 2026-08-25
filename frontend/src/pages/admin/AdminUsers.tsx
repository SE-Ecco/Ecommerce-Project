// WHAT: Super admin views all users across all shops — search, filter, role change
// IMPORTS: services/userService, components/common/{Pagination, SearchBar}
// PROTECTED: role = super_admin only
// WHAT: Super admin manages all users — view, change role, delete
// IMPORTS: userService, Spinner
// PROTECTED: role = super_admin only

import { useEffect, useState } from 'react'
import { getAllUsers, changeUserRole, deleteUser } from '../../services/userService'
import { User } from '../../types'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const ROLES = ['customer', 'shop_admin', 'super_admin']

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load users.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (id: number, role: string) => {
    setUpdatingId(id)
    try {
      const updated = await changeUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update role.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not delete user.')
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
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  disabled={updatingId === user.id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsers