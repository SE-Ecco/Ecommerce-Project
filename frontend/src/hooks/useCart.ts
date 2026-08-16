// WHAT: Simplifies reading cart state + computed values
// IMPORTS: store/cartStore.ts
// USED BY: components/cart/CartDrawer, CartItem, pages/cart/CartPage, layout/Navbar
// RETURNS: items, totalItems, totalPrice, isEmpty, addItem, removeItem, updateQuantity, clearCart
// WHAT: Hook for cart state — reads cartStore, exposes helpers
// IMPORTS: cartStore
// USED BY: Navbar, CartDrawer, CartPage

// WHAT: Hook for cart state — reads cartStore, exposes helpers
// IMPORTS: cartStore
// USED BY: Navbar, CartDrawer, CartPage

import { useCartStore } from '../store/cartStore'

export const useCart = () => {
  const {
    items,
    shopId,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore()

  return {
    items,
    shopId,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}