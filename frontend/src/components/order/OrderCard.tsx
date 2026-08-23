// WHAT: Single product card with image, name, price, add to cart
// IMPORTS: useCart, helpers, react-router-dom
// USED BY: ProductGrid.tsx

import { Card, CardContent, Typography, Box } from '@mui/material'
import { Order } from '../../types'
import { formatPrice, formatDate } from '../../utils/helpers'
import OrderStatus from '../order/OrderStatus'

interface Props {
  order: Order
}

const OrderCard = ({ order }: Props) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Order #{order.id}
          </Typography>
          <OrderStatus status={order.status} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {formatDate(order.created_at || '')}
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
          Total: {formatPrice(order.total_price)}
        </Typography>

        {order.items && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {order.items.length} item(s)
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderCard