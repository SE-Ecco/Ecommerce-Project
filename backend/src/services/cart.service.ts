import CartItem from '../models/Cartitem';

export const addToCart = async (
    user_id: number,
    shop_id: number,
    product_id: number,
    quantity: number
) => {
    const existing = await CartItem.findOne({
        where: { user_id, shop_id, product_id },
    });

    if (existing) {
        existing.set('quantity', existing.get('quantity') + quantity);
        await existing.save();
        return existing;
    }
    return await CartItem.create({
        user_id,
        shop_id,
        product_id,
        quantity,
    });
};

export const getCart = async (
    user_id: number,
    shop_id: number,
) => {
    return await CartItem.findAll({ where: { user_id, shop_id } });
}

export const updateQuantity = async (
    id: number,
    user_id: number,
    quantity: number
) => {
    const item = await CartItem.findOne({
        where: { id, user_id },
    });

    if (!item) {
        throw new Error('Cart item not found');
    }

    if (!quantity || quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    item.set('quantity', quantity);
    await item.save();

    return item;
};

export const removeFromCart = async (
    id: number,
    user_id: number,
) => {
    const item = await CartItem.findOne({
        where: { id, user_id },
    });

    if (!item) {
        throw new Error('Cart item not found');
    }

    await item.destroy();
    return { message: 'Item removed from cart' };
};


// ── 🍽️ THE STORY (for teaching the team) ──────────────────
//
// cart.service.ts = the SHOPPING BASKET attendant at the store entrance 🛒
//
// import CartItem → this is the attendant's clipboard, connected to the
//                    real "cart_items" table in the database
//
// addToCart(user_id, shop_id, product_id, quantity):
//   customer walks up: "put 2 olive oils in my basket!"
//   attendant FIRST checks the clipboard: "does this customer already
//   have olive oil in their basket?"
//     → YES: attendant doesn't add a second olive oil line — just writes
//            a bigger number next to the existing one (quantity + quantity)
//            .set() edits the number, .save() writes it permanently
//     → NO: attendant adds a brand new line to the basket (CartItem.create)
//   WHY check first: without this, the same customer adding olive oil
//   twice would try to write TWO lines for the same product — but the
//   database has a rule (UNIQUE constraint) that FORBIDS that, so it
//   would crash instead of just updating the number
//
// getCart(user_id, shop_id):
//   customer asks: "what's in my basket right now?"
//   attendant looks up ONLY this customer's basket, for THIS shop
//   (a basket from a different shop never mixes in — one shop at a time)
//
// updateQuantity(id, user_id, quantity):
//   customer says: "actually, change it to exactly 5 olive oils"
//   attendant finds THAT specific basket line (by its own id),
//   double-checks it's really THIS customer's line (user_id match),
//   crosses out the old number, writes the new one (.set), saves it
//   if the line doesn't exist / belongs to someone else → refuses,
//   "Cart item not found" (doesn't reveal WHICH reason, for security)
//
// removeFromCart(id, user_id):
//   customer says: "take the olive oil out of my basket"
//   attendant finds the exact line (same double-check as above),
//   then throws that line away completely (.destroy())
//   returns a simple confirmation message, not the deleted item
//   (nothing left to hand back — it's gone!)
//
// SECURITY RULE running through EVERY function:
//   user_id always comes from the LOGGED-IN person (JWT token, set in
//   the controller) — never trusted from what the customer TYPES —
//   otherwise anyone could edit or empty someone else's basket



// 📖 cart.service.ts — line by line 🛒

// typescriptimport CartItem from '../models/Cartitem'
// 📌 import → brings in the Sequelize model for the cart_items table
// 📌 CartItem → this is our "clipboard" — every function below uses it
//     to talk to the real database table
// 📌 no { } around CartItem → it's a DEFAULT export (like Product, Category)

// typescriptexport const addToCart = async (
// 📌 export const → other files (cart.controller.ts) can import this
// 📌 async → this function will await database calls, which take time

// typescript    user_id: number,
// 📌 WHO is adding the item — always comes from JWT in the controller,
//     NEVER trust this from req.body (someone could fake being another user)

// typescript    shop_id: number,
// 📌 WHICH shop this cart item belongs to — cart is per-shop
//     (can't mix Zaytoon's olive oil + Duhok Bakery's bread in one basket)

// typescript    product_id: number,
// 📌 WHICH product they're adding to the cart

// typescript    quantity: number
// 📌 HOW MANY units of that product

// typescript) => {
// 📌 closes the parameter list, opens the function body

// typescript    const existing = await CartItem.findOne({
//         where: { user_id, shop_id, product_id },
//     })
// 📌 findOne → asks the database: "does this EXACT user already have
//     this EXACT product in their cart for this shop?"
// 📌 returns either the matching row, or null if nothing matches
// 📌 WHY we check first: CartItem has a UNIQUE(user_id, product_id, variant_id)
//     rule in the database — trying to .create() a duplicate would CRASH
//     the whole request instead of just updating the quantity

// typescript    if (existing) {
// 📌 "if we found a matching row" — this product is ALREADY in their cart

// typescript        existing.set('quantity', existing.get('quantity') + quantity)
// 📌 .get('quantity') → reads the CURRENT number sitting in that row
// 📌 + quantity → adds the NEW amount on top of it
// 📌 .set('quantity', ...) → writes that new total into memory (not saved yet)
// 📌 story: 2 olive oils already in cart + adding 1 more = .set() to 3

// typescript        await existing.save()
// 📌 .save() → writes the change from memory into the REAL database row
// 📌 await → we wait for this to finish before moving on

// typescript        return existing
// 📌 hand back the updated row to whoever called this function

// typescript    }
// 📌 closes the if-block

// typescript    return await CartItem.create({
//         user_id,
//         shop_id,
//         product_id,
//         quantity,
//     })
// }
// 📌 only reached if NO existing row was found above
// 📌 CartItem.create() → makes a brand new row in cart_items
// 📌 shorthand { user_id, shop_id, product_id, quantity } →
//     same as writing { user_id: user_id, shop_id: shop_id, ... }
// 📌 closes the whole addToCart function

// ─────────────────────────────────────────────

// typescriptexport const getCart = async (
//     user_id: number,
//     shop_id: number,
// ) => {
// 📌 same idea as before — WHO is asking, WHICH shop's cart to show

// typescript    return await CartItem.findAll({ where: { user_id, shop_id } })
// }
// 📌 findAll (not findOne!) → a cart usually holds MANY items, not just one
// 📌 where: { user_id, shop_id } → double filter — only shows THIS user's
//     items, for THIS shop — never leaks another user's or another shop's cart

// ─────────────────────────────────────────────

// typescriptexport const updateQuantity = async (
//     id: number,
//     user_id: number,
//     quantity: number
// ) => {
// 📌 id → the cart_item row's OWN id (not the product's id!)
// 📌 user_id → security check, proves this row really belongs to them
// 📌 quantity → the NEW exact number (user typed it directly)

// typescript    const item = await CartItem.findOne({
//         where: { id, user_id },
//     })
// 📌 searches by BOTH id AND user_id together
// 📌 WHY both: if item #5 actually belongs to someone else, this search
//     returns null instead of accidentally editing a stranger's cart

// typescript    if (!item) {
//         throw new Error('Cart item not found')
//     }
// 📌 !item → "if nothing was found" (wrong id, or belongs to another user)
// 📌 throw → stops the function here, controller will catch this error
// 📌 ONE message for both cases (not found / wrong owner) → doesn't leak
//     which reason it was — better security

// typescript    item.set('quantity', quantity)
//     await item.save()
//     return item
// }
// 📌 .set() → OVERWRITES the quantity completely (not adding, like addToCart)
//     because the user typed an exact new number, not "add 1 more"
// 📌 .save() → writes it to the database
// 📌 return item → hands back the updated row

// ─────────────────────────────────────────────

// typescriptexport const removeFromCart = async (
//     id: number,
//     user_id: number,
// ) => {
// 📌 same 2 inputs as updateQuantity — which row, and who's asking

// typescript    const item = await CartItem.findOne({
//         where: { id, user_id },
//     })
//     if (!item) {
//         throw new Error('Cart item not found')
//     }
// 📌 exact same security check pattern as updateQuantity — find first,
//     confirm it's really theirs, THEN act on it

// typescript    await item.destroy()
// 📌 .destroy() → DELETE FROM cart_items WHERE id = ? — row is gone for good

// typescript    return { message: 'Item removed from cart' }
// }
// 📌 nothing left to hand back (it's deleted!), so we send a simple
//     confirmation message instead of the item itself

// 🎯 big picture — how this file fits the app:
// 1️⃣ customer clicks "Add to Cart" on a product page
// 2️⃣ cart.controller.ts reads req.user.id (JWT) + req.body (product, qty)
// 3️⃣ controller calls addToCart(user_id, shop_id, product_id, quantity)
// 4️⃣ if already in cart → quantity goes UP, no duplicate row created
// 5️⃣ if new → fresh row created
// 6️⃣ getCart() → shows everything currently in that user's basket
// 7️⃣ updateQuantity() / removeFromCart() → both double-check user_id
//     FIRST, so nobody can ever edit or delete someone else's cart
// 🧠 why this matters: user_id NEVER comes from req.body — always from
//     the JWT token set by auth.middleware — this is what makes the
//     cart actually SECURE, not just functional