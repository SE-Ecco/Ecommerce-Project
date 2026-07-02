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
declare global {                          // "I am declaring something globally"
                                          // affects TypeScript everywhere
    namespace Express{
        interface Request{
            user?:{id: number , email: string , role:string ,shop_id?:number}
        }
    }
}
export {}
/*
imagine Express is a big house 🏠

the house has rooms:
  kitchen
  bedroom
  bathroom

namespace Express = the house itself 🏠
interface Request = one room inside (kitchen) 🍳

we are not building a new house ❌
we are adding something to an existing room ✅

"hey kitchen! you now also have a coffee machine"
→ req.user = the coffee machine */