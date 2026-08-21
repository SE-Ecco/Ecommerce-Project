// WHAT: Colored status badge — pending/confirmed/shipped/delivered/cancelled
// IMPORTS: utils/helpers (getStatusColor), @mui/material (Chip)
// USED BY: OrderCard.tsx, pages/owner/OwnerOrders.tsx
// STATUSES: pending (yellow), confirmed (blue), shipped (purple), delivered (green), cancelled (red)

// WHAT: Colored status badge — pending/confirmed/shipped/delivered/cancelled
// IMPORTS: @mui/material (Chip), utils/helpers (getStatusColor)
// USED BY: OrderCard.tsx, pages/owner/OwnerOrders.tsx

import Chip from '@mui/material/Chip';
import { getStatusColor } from '../../utils/helpers';

interface OrderStatusProps {
  status: string;
}

export default function OrderStatus({ status }: OrderStatusProps) {
  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      size="small"
    />
  );
}

// NOTES:
// → OrderStatusProps: this component takes exactly one prop, status (a
//   string like "pending", "shipped", etc.) — nothing else, keeping it
//   small and reusable in any context that just needs to show a status.
// → destructuring { status } straight from props: cleaner than writing
//   props.status everywhere inside the component.
// → Chip: MUI's built-in badge/pill component — used instead of a custom
//   styled <span>, so it automatically matches the rest of the app's MUI
//   theme (spacing, border radius, font) without extra CSS work.
// → color={getStatusColor(status)}: this is the whole point of the
//   component — it never hardcodes which status is which color. It asks
//   the shared helper function every time, so if the color mapping ever
//   needs to change, it's a one-line fix in helpers.ts, not a hunt through
//   every file that shows a status.
// → size="small": keeps the badge compact enough to sit inline inside an
//   OrderCard row or a dense OwnerOrders table without dominating the layout.
// → label={status}: shows the raw status word as-is (e.g. "shipped"). No
//   capitalization or translation applied yet — can be added later if the
//   design wants "Shipped" instead of "shipped".

/** STORY
 * OrderStatus is the little traffic light sitting next to each order —
 * it doesn't decide the colors itself, it just asks the control box
 * (getStatusColor) what color today's status is, and lights up accordingly,
 * the same light used whether a customer is checking their own order or
 * a shop owner is scanning a whole table of them.
 */
