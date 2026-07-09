// WHAT: Handles HTTP requests for shop info (public)
// IMPORTS: services/shop.service.ts, utils/response.ts
// USED BY: routes/shop.routes.ts
// HANDLES: GET all shops, GET shop by slug
import { Request, Response } from 'express'
import { getShopsList, getShopBySlugFromDB } from '../services/shop.service'
import { successResponse, errorResponse } from '../utils/response'

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await getShopsList()
    res.json(successResponse(shops))
  }
  catch (error) {
    res.status(500).json(errorResponse('Failed to fetch shops'))
  } }

  export const getShopBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const shop = await getShopBySlugFromDB(slug)
    res.json(successResponse(shop))
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get shop'))
  }
}








// 📖 shop.controller.ts — step by step 🧑‍🍳
// typescriptimport { Request, Response } from 'express'
// 📌 Request  → TypeScript shape for incoming request (params, body, query)
// 📌 Response → TypeScript shape for what you send back (res.json, res.status)
// 📌 without these, TypeScript won't know what "req" and "res" are allowed to do

// typescriptimport { getShopsList, getShopBySlugFromDB } from '../services/shop.service'
// 📌 pulling in the 2 "kitchen" functions
// 📌 these do the REAL database work (not written yet — next file)
// 📌 controller just calls them, never touches DB directly

// typescriptimport { successResponse, errorResponse } from '../utils/response'
// 📌 your 2 helper functions from response.ts (already done ✅)
// 📌 successResponse(data) → { success: true, data }
// 📌 errorResponse(msg)    → { success: false, message }
// 📌 keeps ALL API replies same shape — frontend always knows what to expect

// 🧑‍🍳 function 1: getAllShops

// typescriptexport const getAllShops = async (req: Request, res: Response) => {
// 📌 export const → so shop.routes.ts can import this function
// 📌 async         → this function will "await" (wait for) the database
// 📌 (req, res)    → every controller gets these 2 automatically from Express

// typescript  try {
//     const shops = await getShopsList()
// 📌 try → "attempt this, and if it breaks, don't crash — go to catch"
// 📌 await getShopsList() → pauses here until service finishes talking to DB
// 📌 shops → holds whatever the DB returns (array of shop rows)

// typescript    res.json(successResponse(shops))
// 📌 res.json(...) → sends data back to whoever called the API (frontend/Postman)
// 📌 wrapped in successResponse → so frontend gets { success: true, data: shops }

// typescript  } catch (error) {
//     res.status(500).json(errorResponse('Failed to fetch shops'))
//   }
// }
// 📌 catch (error) → runs ONLY if try block throws (DB down, bug, etc)
// 📌 status(500)   → HTTP code meaning "server messed up"
// 📌 errorResponse → sends { success: false, message: '...' } instead of crashing app

// 🧑‍🍳 function 2: getShopBySlug
// typescriptexport const getShopBySlug = async (req: Request, res: Response) => {
//   try {
//     const { slug } = req.params

// 📌 req.params → grabs values from the URL itself
// 📌 route is '/slug/:slug' → so if URL is /api/shops/slug/zaytoon-store
// 📌 req.params.slug = "zaytoon-store"
// 📌 { slug } = ... → destructuring, just pulls that one value out cleanly

// typescript    const shop = await getShopBySlugFromDB(slug)
// 📌 passes that slug string into the service function
// 📌 service will search DB: "find me the shop where slug = this value"
// typescript    res.json(successResponse(shop))
//   } catch (error) {
//     res.status(500).json(errorResponse('Failed to get shop'))
//   }
// }
// 📌 same pattern as function 1 — success wraps data, catch handles failure

// 🎯 big picture flow:
// 1️⃣ request hits shop.routes.ts
// 2️⃣ routes.ts calls controller function
// 3️⃣ controller calls service function (not written yet)
// 4️⃣ service talks to DB, returns data
// 5️⃣ controller wraps it → sends back to caller