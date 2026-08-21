// WHAT: Colored status badge — pending/confirmed/shipped/delivered/cancelled
// IMPORTS: utils/helpers (getStatusColor), @mui/material (Chip)
// USED BY: OrderCard.tsx, pages/owner/OwnerOrders.tsx
// STATUSES: pending (yellow), confirmed (blue), shipped (purple), delivered (green), cancelled (red)

import { Chip } from '@mui/material'
import { getStatusColor } from '../../utils/helpers'

interface Props {
  status: string
}

const OrderStatus = ({ status }: Props) => {
  return (
    <Chip
      label={status.toUpperCase()}
      color={getStatusColor(status)}
      size="small"
    />
  )
}

export default OrderStatus