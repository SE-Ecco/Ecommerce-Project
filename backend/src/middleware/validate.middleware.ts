// WHAT: Checks express-validator results — runs AFTER validation rules
// IMPORTS: express-validator (validationResult)
// USED BY: routes/auth.routes.ts, routes/product.routes.ts, routes/order.routes.ts
// FLOW: validation rules run → validate() checks results → error? send 400 : call next()
// EXPORTS: validate()
