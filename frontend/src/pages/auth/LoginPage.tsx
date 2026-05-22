// WHAT: Login page with email + password form
// IMPORTS: formik, validations/authValidation, services/authService, hooks/useAuth
// FLOW: submit form → call loginService → save to authStore → redirect by role
//   super_admin → /admin/dashboard
//   shop_admin  → /owner/dashboard
//   customer    → /
