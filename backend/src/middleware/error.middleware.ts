// WHAT: Global error handler — catches ALL errors from ALL routes
// IMPORTS: Nothing
// USED BY: app.ts (must be the LAST middleware registered!)
// FLOW: any controller calls next(error) → this runs → sends clean JSON error response
// EXPORTS: errorHandler()
import { errorResponse } from '../utils/response'
import { Request, Response, NextFunction } from 'express';

// line 1 → brings the "error " function from response.ts
// line 2 → brings 3 types FROM Express package
//           Request, Response, NextFunction
//           these describe the shape of req, res, next
export const errorMiddleware = (
    err:Error,
    req: Request,
    res: Response,
    next: NextFunction          

//     export       → share with app.ts
// const errorMiddleware → name of our function
// (err, req, res, next) → 4 PARAMS
//                         Express sees 4 params
//                         → auto-treats this as ERROR middleware 🎯
//                         (normal middleware only has 3: req, res, next)
) => {

   console.error(err);  

//    prints the FULL error in your terminal
// so YOU (developer) can debug it 🔍
// customer never sees this

   const message = process.env.NODE_ENV === 'production'
     ? 'Something went wrong. Please try again later.'
     : err.message;

   res.status(500).json(errorResponse(message))


//    res.status(500) → tell browser "server error happened" 💥
// .json(...)       → send JSON back
// errorResponse(err.message) → wraps it in our standard plate 🍽️
//                              { success: false, message: "..." }
}
