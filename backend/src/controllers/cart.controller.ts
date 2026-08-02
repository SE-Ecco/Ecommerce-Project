import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import { successResponse, errorResponse } from '../utils/response';

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const user_id = req.user!.id as number;
    const { product_id, quantity } = req.body;

    const item = await cartService.addToCart(user_id, shop_id, product_id, quantity);
    res.status(201).json(successResponse(item));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop_id = req.user!.shop_id as number;
    const user_id = req.user!.id as number;
    const cart = await cartService.getCart(user_id, shop_id);
    res.status(200).json(successResponse(cart));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const updateQuantity = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id as number;
    const id = Number(req.params.id);
    const { quantity } = req.body;
    const item = await cartService.updateQuantity(id, user_id, quantity);
    res.status(200).json(successResponse(item));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const removeFromCart = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id as number;
    const id = Number(req.params.id);
    const result = await cartService.removeFromCart(id, user_id);
    res.status(200).json(successResponse(result));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};



// 📖 cart.controller.ts — line by line 🛒

// (addToCart and getCart line-by-line comments — already given above,
//  same file, just adding the story block now)

// ── 🍽️ THE STORY (for teaching the team) ──────────────────
//
// cart.controller.ts = the CHECKOUT WORKER at the store counter 🛒
//
// import Request, Response → the worker's notepad + reply slip —
//                             same shape every controller uses
// import cartService → the intercom line to the back-room clerk
//                       (the worker never goes back there themselves)
// import successResponse/errorResponse → the worker's standard
//                       receipt template, same box for every reply
//
// addToCart(req, res):
//   customer walks up: "add this product to my basket, 2 of them!"
//   worker checks the customer's ID badge is really clipped on
//     (req.user!.shop_id, req.user!.id — set earlier by auth.middleware)
//   worker reads what they want off the order slip (req.body)
//   worker calls the intercom to the clerk: "user 7, shop 1,
//     product 3, quantity 2!" (cartService.addToCart)
//   clerk does the real work, hands back the updated basket line
//   worker staples a "201 Created" receipt on it and hands it over
//   if the intercom call fails for any reason → worker apologizes
//     with a 500 receipt instead, doesn't try to fix it themselves
//
// getCart(req, res):
//   customer asks: "what's in my basket right now?"
//   worker again checks WHO is asking + WHICH store (shop_id, user_id)
//   calls the clerk: "show me user 7's basket for shop 1"
//   clerk hands back the list (maybe empty — that's still fine!)
//   worker staples a "200 OK" receipt, hands the list back
//   if something breaks → 500, same as above (empty cart ≠ error,
//     so this ISN'T a 404 case)
//
// updateQuantity(req, res):
//   customer says: "actually make it exactly 5, not 3!"
//   worker checks their badge (user_id) + finds the exact receipt line
//     (id from the URL), passes the new number to the clerk
//   clerk double-checks it's really THEIR line, updates it, hands it back
//   worker staples a "200 OK" receipt
//   if the line doesn't exist / isn't theirs → "404, not found" receipt
//     (not a 500 — this is an expected, normal kind of failure)
//
// removeFromCart(req, res):
//   customer says: "take this off my order completely"
//   worker checks badge + which line (same as above), tells the clerk
//     to throw it out — clerk confirms ownership first, then deletes
//   worker hands back a simple "removed!" confirmation, 200 OK
//   same 404 logic if the line isn't real or isn't theirs
//
// WHY the controller never talks to CartItem directly:
//   the worker at the counter doesn't go digging through the
//   stockroom themselves — they just relay requests to the clerk
//   (service) and hand back whatever the clerk found. Keeps each
//   job separate: controller = talk to the customer/internet,
//   service = talk to the database




// 📖 cart.controller.ts — line by line 🛒

// typescriptimport { Request, Response } from 'express'
// 📌 Request, Response → the shape of every incoming request and outgoing reply
// 📌 same import every controller in your project uses

// typescriptimport * as cartService from '../services/cart.service'
// 📌 pulls in ALL the functions from cart.service.ts as one object
// 📌 called like cartService.addToCart(...), cartService.getCart(...)
// 📌 controller NEVER touches CartItem directly — only talks to the service

// typescriptimport { successResponse, errorResponse } from '../utils/response'
// 📌 successResponse → wraps good replies as { success: true, data: ... }
// 📌 errorResponse → wraps failed replies as { success: false, message: ... }
// 📌 keeps EVERY response in your whole API the same shape, no matter the file

// ─────────────────────────────────────────────

// typescriptexport const addToCart = async (req: Request, res: Response): Promise<void> => {
// 📌 export const → so cart.routes.ts can import and use this function
// 📌 async → we'll be awaiting a database call inside
// 📌 : Promise<void> → this function doesn't return a usable value,
//     it just sends the response itself and finishes

// typescript  try {
// 📌 wraps everything risky (DB calls can fail) — if anything inside throws,
//     we jump straight down to catch instead of crashing the whole server

// typescript    const shop_id = req.user!.shop_id as number
// 📌 req.user → was ATTACHED earlier by auth.middleware (runs before this)
// 📌 ! → "trust me, this exists" (auth.middleware guarantees it)
// 📌 as number → tells TypeScript the exact type, since req.user's type
//     might allow shop_id to be undefined
// 📌 WHICH shop this cart belongs to

// typescript    const user_id = req.user!.id as number
// 📌 same idea, but pulling the user's OWN id this time
// 📌 WHO is doing the adding — NEVER trust an id sent in req.body,
//     someone could type someone ELSE's id and mess with their cart

// typescript    const { product_id, quantity } = req.body
// 📌 destructuring → pulls product_id and quantity straight out of the
//     JSON body the client sent
// 📌 safe to trust from req.body — it's just "what to add", not "who I am"

// typescript    const item = await cartService.addToCart(user_id, shop_id, product_id, quantity)
// 📌 hands off ALL 4 values to the service function we built earlier
// 📌 await → pause here until the database actually finishes the work
// 📌 controller doesn't know/care HOW addToCart works internally —
//     that's the service's job (separation of concerns)

// typescript    res.status(201).json(successResponse(item))
// 📌 201 → "something was CREATED" (new cart row, or quantity bumped up)
// 📌 successResponse(item) → wraps the returned cart item in the
//     standard { success: true, data: item } shape

// typescript  } catch (error) {
//     res.status(500).json(errorResponse((error as Error).message))
//   }
// }
// 📌 catch → runs ONLY if something inside try{} threw an error
// 📌 500 → unexpected server error (not the customer's fault)
// 📌 (error as Error).message → TypeScript treats caught errors as
//     type "unknown" by default, so we tell it "trust me, it's an Error"
//     to safely read .message off it
// 📌 closes the whole addToCart function

// ─────────────────────────────────────────────

// typescriptexport const getCart = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const shop_id = req.user!.shop_id as number
//     const user_id = req.user!.id as number
// 📌 exact same 2 lines as addToCart — WHO is asking, WHICH shop

// typescript    const cart = await cartService.getCart(user_id, shop_id)
// 📌 calls the service's getCart — just a READ, no new data created

// typescript    res.status(200).json(successResponse(cart))
// 📌 200 → "here's the data you asked for" (not 201, nothing was CREATED)
// 📌 sends back whatever list of items the service found (could be empty!)

// typescript  } catch (error) {
//     res.status(500).json(errorResponse((error as Error).message))
//   }
// }
// 📌 500 here too, NOT 404 — an EMPTY cart is still a totally valid,
//     successful result (not an error), so 404 wouldn't make sense

// 🎯 big picture — how controller connects to everything else:
// 1️⃣ request arrives at a route (e.g. POST /api/cart)
// 2️⃣ auth.middleware runs FIRST → verifies JWT → attaches req.user
// 3️⃣ shopMiddleware runs NEXT → confirms req.user.shop_id exists
// 4️⃣ controller function runs → reads req.user + req.body
// 5️⃣ controller calls the matching cartService function
// 6️⃣ service does the REAL database work, returns a result
// 7️⃣ controller wraps that result in successResponse/errorResponse
//     and sends it back — controller NEVER touches CartItem directly
// 🧠 why split controller + service: controller = "talk to the internet"
//     (req/res), service = "talk to the database" — keeping them
//     separate means you can test/reuse the service logic without
//     needing a fake HTTP request every time