// WHAT: Global wishlist state — customer's saved/favorited products
// IMPORTS: zustand, zustand/middleware (persist), types
// USED BY: hooks/useWishlist.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistItem } from '../types'
interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void     // 🔧 takes full WishlistItem (with id)
  removeItem: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some((i) => i.product.id === item.product.id)
        if (!exists) {
          set({ items: [...get().items, item] }) // 🔧 stores full item with id
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.product.id !== productId),
        })
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.product.id === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

// NOTES:
// → create + persist (zustand) — same middleware pattern as cartStore, so this store
//   auto-saves to localStorage and reloads on page refresh. Wishlist needs to survive
//   sessions (unlike shopStore), so persist is required here.
//
// → WishlistItem, Product (types) — WishlistItem is { product: Product }, same shape
//   family as CartItem but without quantity, since wishlist items aren't "how many,"
//   just "saved or not."
//
// → items: [] — starts empty, holds the full Product object wrapped in { product }
//   (not just IDs) so WishlistPage.tsx can display images/name/price directly without
//   re-fetching each product from the backend.
//
// → addItem(product) — checks `exists` first using .some() to prevent duplicate
//   entries (heart-clicking the same product twice shouldn't add it twice). Only
//   spreads in the new item if it isn't already there.
//
// → removeItem(productId) — uses .filter() to keep everything except the matching
//   product id. This is the un-heart action.
//
// → isInWishlist(productId) — the function ProductCard.tsx will call to decide
//   whether to render a filled or empty heart icon for a given product, without
//   needing to loop through items itself.
//
// → clearWishlist() — resets items back to [], for a "clear all" button on
//   WishlistPage.tsx later.
//
// → name: 'wishlist-storage' — the localStorage key, following the exact naming
//   pattern cartStore uses ('cart-storage'), so it's easy to recognize in devtools.

/** STORY
 * wishlistStore is the customer's favorites shelf at home. They see a product in
 * a Duhok shop, aren't ready to buy, but tap ❤️ to remember it. It sits on that
 * shelf (persisted) even after they close the app, so it's still there tomorrow —
 * unlike the shopping basket (cartStore), which only matters while they're actively
 * shopping.
 */
