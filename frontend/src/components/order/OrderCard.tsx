// WHAT: Single product card with image, name, price, add to cart
// IMPORTS: useCart, helpers, react-router-dom
// USED BY: ProductGrid.tsx

import { Card, CardMedia, CardContent, CardActions, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/helpers'
import { Product } from '../../types'
import Button from '../common/Button'

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({ product, quantity: 1 })
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image='/placeholder.png'
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
          {formatPrice(product.price)}
        </Typography>
        {product.description && (
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          {product.is_available ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Link to={`/products/${product.id}`}>
          <Button variant="outlined" fullWidth>
            View
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

export default ProductCard