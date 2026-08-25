// WHAT: Hook that gives components easy access to wishlistStore (global favorites state)
// IMPORTS: store/wishlistStore
// USED BY: ProductCard.tsx (heart icon), WishlistPage.tsx, possibly Navbar.tsx (badge count)

import { useWishlistStore } from '../store/wishlistStore';

export function useWishlist() {
  const { items, addItem, removeItem, isInWishlist, clearWishlist } = useWishlistStore();

  const totalItems = items.length;
  const isEmpty = items.length === 0;

  return { items, totalItems, isEmpty, addItem, removeItem, isInWishlist, clearWishlist };
}

// NOTES:
// → useWishlistStore (store/wishlistStore) — this hook is a thin wrapper, same
//   relationship useAuth has with authStore and useCart has with cartStore. It
//   destructures the store's state and actions straight through, with no logic
//   changes to addItem/removeItem/isInWishlist/clearWishlist themselves.
//
// → totalItems — derived from items.length, not stored separately in the store
//   itself (same pattern as useAuth's isCustomer/isShopAdmin being calculated on
//   the fly, not saved as extra fields). Useful for a badge count, e.g. on Navbar.
//
// → isEmpty — a quick boolean so WishlistPage.tsx can show a "no favorites yet"
//   message instead of rendering an empty grid, without every component having to
//   write `items.length === 0` itself.
//
// → return { ... } — hands components one clean object: raw items, two derived
//   convenience values, and all 4 store actions. Components never call
//   useWishlistStore() directly — they always go through this hand.

/** STORY
 * If wishlistStore is the favorites shelf, useWishlist is the one hand every
 * component uses to reach for it — the heart icon on ProductCard, the full list
 * on WishlistPage, a badge count on Navbar. They all reach through the same hand
 * instead of grabbing the shelf themselves, so if anything about the shelf ever
 * changes, only this one hand needs to adjust.
 */