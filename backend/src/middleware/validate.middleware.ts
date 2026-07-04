// WHAT: Checks express-validator results — runs AFTER validation rules
// IMPORTS: express-validator (validationResult)
// USED BY: routes/auth.routes.ts, routes/product.routes.ts, routes/order.routes.ts
// FLOW: validation rules run → validate() checks results → error? send 400 : call next()
// EXPORTS: validate()
import { Request, Response, NextFunction, request } from 'express'

import { validationResult } from 'express-validator'
// brings a function that COLLECTS all validation errors
// from the request (set up earlier by rules files)
import { errorResponse } from '../utils/response'

// our own helper → wraps error in standard plate 🍽️
// { success: false, message: "..." }
// brings 3 shapes from Express package
// tells TypeScript what req, res, next look like

export const validateMiddleware = (
  req: Request,

  res:Response,

  next: NextFunction

// export        → share with routes files
// 3 params      → normal middleware (not error middleware, that needs 4)
// req: Request  → incoming request shape
// res: Response → used to send reply
// next: NextFunction → call this to continue to controller
) => {

  const errors = validationResult(req)
// checks the request against rules set earlier
// (rules like "email must be valid" from auth.validation.ts)
// returns a collection of any errors found
  if (!errors.isEmpty()) {
// isEmpty() → true if NO errors, false if errors exist
// !          → flips it: "if NOT empty" = "if errors EXIST"
return res.status(400).json(errorResponse(JSON.stringify(errors.array())))  }
// status(400)      → "bad request" — user sent invalid data
// errors.array()   → turns errors into an array of objects
// JSON.stringify() → converts array → string (errorResponse needs string)
// errorResponse()  → wraps in standard error plate 🍽️
// .json()          → sends to frontend
// return           → STOPS here, never reaches next()
   next()
// if errors WERE empty → skip the if block
// call next() → pass control to the controller ✅
}

// request arrives → validateMiddleware runs
//    errors found? → 400 + error plate → STOP 🛑
//    no errors?    → next() → controller runs ✅