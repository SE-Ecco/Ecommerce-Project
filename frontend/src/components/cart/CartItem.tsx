// WHAT: One row in the cart — image, name, price, quantity input, remove button
// IMPORTS: hooks/useCart, utils/helpers, @mui/material
// USED BY: CartDrawer.tsx, pages/cart/CartPage.tsx

import { Box, Typography, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/helpers'
import { CartItem as CartItemType } from '../../types'

interface Props {
  item: CartItemType
}

const CartItem = ({ item }: Props) => {
  const { updateQuantity, removeItem } = useCart()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      {/* image */}
      <img
        src='/placeholder.png'
        alt={item.product.name}
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
      />

      {/* name + price */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {item.product.name}
        </Typography>
        <Typography variant="body2" color="primary">
          {formatPrice(item.product.price)}
        </Typography>
      </Box>

      {/* quantity controls */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          size="small"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>

        <IconButton
          size="small"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* remove button */}
      <IconButton
        color="error"
        onClick={() => removeItem(item.product.id)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}

export default CartItem