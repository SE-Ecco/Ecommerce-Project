// WHAT: Tracks the currently viewed shop
// IMPORTS: zustand, types/index.ts
// USED BY: hooks/useShop.ts
// CONTAINS: currentShop, setShop(), clearShop()

import { create } from 'zustand';
import { Shop } from '../types';

interface ShopState {
  currentShop: Shop | null;
  isLoaded: boolean;
  setShop: (shop: Shop) => void;
  clearShop: () => void;
}

export const useShopStore = create<ShopState>()((set) => ({
  currentShop: null,
  isLoaded: false,
  setShop: (shop) => set({ currentShop: shop, isLoaded: true }),
  clearShop: () => set({ currentShop: null, isLoaded: false }),
}));

// zhegir-NOTES:
// → create<ShopState>(): builds the store, typed with our ShopState shape.
//   No persist() wrapper — unlike authStore/cartStore, this store should
//   NOT survive page refreshes; it should reflect whatever shop the
//   customer is CURRENTLY viewing based on the URL
// → Shop: imported type describing a shop object (id, name, slug, etc.)
//   from types/index.ts
// → (set): only set is needed here — no get(), since neither action needs
//   to read existing state before deciding what to do
// → currentShop: Shop | null — the shop currently being viewed; null means
//   no specific shop is active (e.g. customer is on the homepage)
// → isLoaded: boolean — lets components know if shop data has actually
//   finished loading, so they can show a Spinner instead of flashing
//   empty/wrong content
// → setShop(shop): called inside a useEffect tied to the shop's slug —
//   runs when a shop page first loads, or when the customer navigates to
//   a DIFFERENT shop (slug changes). Sets both currentShop AND isLoaded
//   together in one call.
// → clearShop(): resets both fields back to empty — used when the
//   customer navigates away from any specific shop (e.g. back to homepage)

/** STORY
 * shopStore is the "You Are Here 📍" sign at Jiwar's mall directory.
 *
 * Unlike the membership card (authStore) or the shopping basket
 * (cartStore) — things you WANT to carry with you across visits —
 * this sign should only ever reflect where you're standing RIGHT NOW.
 *
 * Walk up to Shop A's storefront → setShop() updates the sign to
 * "You Are Here: Olive & Co." Every component (ProductsPage, ProductForm,
 * CartDrawer) glances at the same sign and knows exactly which stall
 * is active.
 *
 * Walk back to the mall entrance (homepage) → clearShop() wipes the sign
 * clean again. And because there's no persist wrapper, even if you leave
 * the mall entirely and come back tomorrow, the sign doesn't lie and
 * claim you're still standing at yesterday's stall — it waits for the
 * URL to tell it fresh, every time.
 */