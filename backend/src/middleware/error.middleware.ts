import { errorResponse } from '../utils/response'
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
) => {
   console.error(err);  

   const statusCode = err.statusCode || 500;
   const message = process.env.NODE_ENV === 'production'
     ? 'Something went wrong. Please try again later.'
     : err.message;

   res.status(statusCode).json(errorResponse(message))
}