// WHAT: Global cart state — items list, total, shop context, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts
// USED BY: hooks/useCart.ts
// CONTAINS: items[], shopId, addItem(), removeItem(), updateQuantity(), clearCart()
// ⚠️ Cart is always tied to ONE shop — adding from a different shop clears the cart
