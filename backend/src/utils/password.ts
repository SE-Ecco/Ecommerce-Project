// WHAT: Hash passwords with bcrypt + compare on login
// IMPORTS: bcryptjs
// USED BY: services/auth.service.ts
// CONTAINS: hashPassword(plain), comparePassword(plain, hash)
// ⚠️ NEVER store plain text passwords!
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;  //how many times bcrypt scrambles the password

export const hashPassword = (password: string): Promise<string> => //takes plain password as string
  bcrypt.hash(password, SALT_ROUNDS);   //returns a promise that resolves to the hashed password a a string

/*
→ takes plain password as string
→ calls bcrypt.hash() → adds random salt + scrambles it
→ returns a Promise because hashing takes time (async operation)
→ result = long scrambled string like "$2b$12$x8Kq2..."
→ THIS is what gets saved in the database, never the plain password! */

export const comparePassword = ( //takes plain password and hashed password as strings
  password: string,  //
  hash: string //returns a promise that resolves to a boolean indicating if the password matches the hash
): Promise<boolean> => bcrypt.compare(password, hash); //returns a promise that resolves to a boolean indicating if the password matches the hash 
