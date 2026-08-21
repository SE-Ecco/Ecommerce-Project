// WHAT: Single wishlist item row — image, name, price, remove button
// IMPORTS: @mui/material, helpers, wishlistService
// USED BY: WishlistPage.tsx

import { Box, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatPrice } from '../../utils/helpers'
import { Product } from '../../types'

interface Props {
  product: Product
  wishlistId: number
  onRemove: (wishlistId: number) => void
}

const WishlistItem = ({ product, wishlistId, onRemove }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
      {/* image */}
      <img
        src='/placeholder.png'
        alt={product.name}
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
      />

      {/* name + price */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="primary">
          {formatPrice(product.price)}
        </Typography>
      </Box>

      {/* remove button */}
      <IconButton
        color="error"
        onClick={() => onRemove(wishlistId)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}

export default WishlistItem