// WHAT: Full cart page — list all items, update quantities, clear, checkout
// IMPORTS: hooks/useCart, components/cart/CartItem, utils/helpers
// WHAT: Full cart page — list items, total, checkout button
// IMPORTS: useCart, CartItem, helpers
// USED BY: routes/index.tsx → /cart

import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import CartItem from '../../components/cart/CartItem'
import { formatPrice } from '../../utils/helpers'
import Button from '../../components/common/Button'

const CartPage = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <Button onClick={() => navigate('/')}>Browse Shops</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Cart ({totalItems} items)
      </h1>

      {/* items */}
      <div className="bg-white border rounded-lg p-4 space-y-2 mb-6">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* summary */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-3">
        <Button fullWidth onClick={() => navigate('/checkout')}>
          Checkout
        </Button>
        <Button fullWidth variant="outlined" color="error" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>
    </div>
  )
}

export default CartPage