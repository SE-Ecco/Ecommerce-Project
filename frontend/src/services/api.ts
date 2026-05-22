// WHAT: Configured Axios instance — base for ALL API calls
// IMPORTS: config/constants.ts (API_BASE_URL, AUTH_TOKEN_KEY)
// USED BY: authService, productService, orderService, shopService, categoryService, userService
// KEY: Auto-attaches JWT token to every request. Redirects to /login on 401.
