// WHAT: Rate limiting — prevents brute force attacks
// IMPORTS: express-rate-limit
// USED BY: app.ts (global limiter), routes/auth.routes.ts (strict login limiter)
// EXPORTS:
//   globalLimiter  → 100 requests per 15 minutes per IP (general)
//   authLimiter    → 10 requests per 15 minutes per IP (login/register only)
