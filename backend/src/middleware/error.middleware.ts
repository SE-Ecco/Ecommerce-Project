// WHAT: Global error handler — catches ALL errors from ALL routes
// IMPORTS: Nothing
// USED BY: app.ts (must be the LAST middleware registered!)
// FLOW: any controller calls next(error) → this runs → sends clean JSON error response
// EXPORTS: errorHandler()
