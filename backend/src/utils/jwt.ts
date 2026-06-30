// WHAT: Generate and verify JWT tokens
// IMPORTS: jsonwebtoken, config/env.ts
// USED BY: services/auth.service.ts (generate), middleware/auth.middleware.ts (verify)
// CONTAINS: generateToken(payload), verifyToken(token)
import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

export const generateToken = (payload: object): string =>{
    return jwt.sign(
        payload,                // data stored inside token
        env.JWT_SECRET,         // secret key used to sign token
        {expiresIn: '7d'}       // token expired in 7 days
        
    )
}

/*
    This function creates a JWT token for a user

    (payload: object) 
        -> function parameter called payload
        -> must be an object
        -> contains data like: id, email, role
    
    
    : string -> function returns a string
*/

export const verifyToken = (token: string) => {
    return jwt.verify(
        token,              // token to check
        env.JWT_SECRET      //same secret key used when token was created
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
