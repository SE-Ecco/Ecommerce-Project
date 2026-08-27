// WHAT: Generate and verify JWT tokens
// IMPORTS: jsonwebtoken, config/env.ts
// USED BY: services/auth.service.ts (generate), middleware/auth.middleware.ts (verify)
// CONTAINS: generateToken(payload), verifyToken(token)
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { TokenPayload } from '../types'

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(
        payload,
        env.JWT_SECRET,
        {expiresIn: '7d'}
    )
}

export const verifyToken = (token: string) => {
    return jwt.verify(
        token,
        env.JWT_SECRET
    )
}

/*
    This function checks if a JWT token is valid.

    jwt.verify() 
        -> verifies token
    if token is valid
        -> returns decoded payload
    if token is invalid or expired 
        -> throw error
*/
