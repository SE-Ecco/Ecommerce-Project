// WHAT: Slide-out drawer showing cart items + total + checkout button
// IMPORTS: useCart, CartItem, @mui/material
// USED BY: Navbar.tsx

import { Drawer, Box, Typography, Divider, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/helpers'
import CartItem from './CartItem'

interface Props {
  open: boolean
  onClose: () => void
}

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* header */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cart ({totalItems} items)
        </Typography>

        <Divider />

        {/* empty state */}
        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            {/* items list */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </Box>

            <Divider />

            {/* total */}
            <Box sx={{ py: 2 }}>
              <Typography variant="h6">
                Total: {formatPrice(totalPrice)}
              </Typography>
            </Box>

            {/* buttons */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  )
}

export default CartDrawer