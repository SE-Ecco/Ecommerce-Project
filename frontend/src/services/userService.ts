// WHAT: API calls for user management (admin)
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/admin/AdminUsers
// ENDPOINTS:
//   GET    /api/admin/users                   → list all users (super_admin)
//   PATCH  /api/admin/users/:id/role          → change user role (super_admin)
//   DELETE /api/admin/users/:id               → delete user (super_admin)


import api from './api'
import { User } from '../types'

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/admin/users')
  return response.data.data
}

export const changeUserRole = async (
  id: number,
  role: string
): Promise<User> => {
  const response = await api.patch(`/admin/users/${id}/role`, { role })
  return response.data.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`)
}