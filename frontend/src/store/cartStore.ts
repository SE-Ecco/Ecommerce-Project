// WHAT: Global cart state — items list, total, shop context, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts
// USED BY: hooks/useCart.ts
// CONTAINS: items[], shopId, addItem(), removeItem(), updateQuantity(), clearCart()
// ⚠️ Cart is always tied to ONE shop — adding from a different shop clears the cart

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  shopId: number | null;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shopId: null,
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const { shopId, items } = get();

        if (shopId && shopId !== item.product.shop_id) {
          set({ items: [item], shopId: item.product.shop_id });
        } else {
          const existing = items.find((i) => i.product.id === item.product.id);
          const newItems = existing
            ? items.map((i) =>
                i.product.id === item.product.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...items, item];
          set({ items: newItems, shopId: item.product.shop_id });
        }

        const updatedItems = get().items;
        set({
          totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: updatedItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          ),
        });
      },

      removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.product.id !== productId);
        set({
          items: newItems,
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: newItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          ),
        });
      },

      updateQuantity: (productId, quantity) => {
        const newItems = get().items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        );
        set({
          items: newItems,
          totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: newItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          ),
        });
      },

      clearCart: () =>
        set({ items: [], shopId: null, totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// zhegir-NOTES:
// → CartItem = { product: Product, quantity: number } — there is NO flat
//   `productId`/`shopId` on CartItem itself. Those live INSIDE `product`:
//   item.product.id and item.product.shop_id
// → shopId in CartState is `number | null` (not string) because
//   Product.shop_id is typed as `number` in types/index.ts
// → removeItem/updateQuantity now take `productId: number` to match
//   Product.id's real type
// → all comparisons (shop match, existing item match) now go through
//   .product.id / .product.shop_id instead of flat fields
// → totalPrice math now reads i.product.price (price lives on the nested
//   product object, not directly on the cart item)

/** STORY
 * Same basket logic as before — the fix was just about WHERE the basket
 * actually finds each item's barcode and shop tag. Instead of the tag
 * being stuck directly on the item, it's tucked inside the product info
 * card attached to each item (item.product.id, item.product.shop_id).
 * Once we look in the right pocket, the rest of the basket logic works
 * exactly the same.
 */