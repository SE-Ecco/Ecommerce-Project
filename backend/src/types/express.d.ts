// WHAT: Extends Express Request type so TypeScript knows about req.user and req.shopId
// WHY: Auth middleware adds req.user — without this file TypeScript would give an error
// IMPORTS: Nothing
// USED BY: TypeScript automatically — just having this file is enough
// CONTAINS:
//   declare global {
//     namespace Express {
//       interface Request {
//         user?: { id: number, shop_id: number | null, role: string, email: string }
//         shopId?: number
//       }
//     }
//   }
