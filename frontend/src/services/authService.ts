// WHAT: API calls for authentication
// IMPORTS: services/api.ts, types/index.ts
// USED BY: pages/auth/LoginPage.tsx, pages/auth/RegisterPage.tsx, hooks/useAuth.ts
// ENDPOINTS: POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
// WHAT: API calls for authentication
// IMPORTS: services/api.ts
// USED BY: hooks/useAuth.ts

import api from './api'
import { User } from '../types'

// ===========================
// REGISTER
// ===========================
export const register = async (
  full_name: string,
  email: string,
  password: string,
  phone?: string
) => {
  const response = await api.post('/auth/register', {
    full_name,
    email,
    password,
    phone,
  })
  return response.data.data as { user: User; token: string }
}

// ===========================
// LOGIN
// ===========================
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data.data as { user: User; token: string }
}

// ===========================
// GET ME
// ===========================
export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data.data as User
}