// WHAT: Yup schemas — validation rules for login and register forms
// IMPORTS: yup
// USED BY: pages/auth/LoginPage.tsx, pages/auth/RegisterPage.tsx (via Formik)
// CONTAINS: loginSchema (email, password), registerSchema (full_name, email, phone, password, confirmPassword)
// WHAT: Yup validation schemas for auth forms
// IMPORTS: yup
// USED BY: LoginPage.tsx, RegisterPage.tsx (via Formik)

import * as Yup from 'yup'

// ===========================
// LOGIN SCHEMA
// ===========================
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),
})

// ===========================
// REGISTER SCHEMA
// ===========================
export const registerSchema = Yup.object({
  full_name: Yup.string()
    .required('Full name is required'),

  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),

  phone: Yup.string()
    .optional(),
})