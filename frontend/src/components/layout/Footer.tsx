// WHAT: Bottom footer — copyright, links
// IMPORTS: @mui/material
// USED BY: MainLayout.tsx

import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Jiwar. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

// NOTES:
// → Box (MUI): generic styled container, used here as the outer wrapper for the footer.
//   Chosen over a raw <div> because it accepts the `sx` prop for quick inline styling
//   without writing separate CSS classes.
// → Typography (MUI): handles all text styling consistently across the app (font size,
//   weight, color) instead of using raw <p>/<span> tags with manual CSS.
// → component="footer": tells MUI to render the Box as a real HTML <footer> element
//   instead of a <div> — matters for accessibility (screen readers) and SEO, since
//   <footer> has semantic meaning in HTML5.
// → sx={{ py: 3, textAlign: 'center', bgcolor: 'grey.100' }}: MUI's inline styling system.
//   py: 3 adds vertical padding so the footer doesn't feel cramped. textAlign: 'center'
//   keeps the copyright line centered regardless of screen width. bgcolor: 'grey.100'
//   gives it a light gray background so it visually separates from the main page content
//   above it — a common ecommerce pattern (bottom of Amazon, Noon, etc.).
// → variant="body2": one of MUI's typography presets — smaller than default body text,
//   fitting for low-priority footer content that shouldn't compete with page content.
// → color="text.secondary": muted gray tone (not pure black) — reinforces that footer
//   text is secondary information, not something the customer needs to focus on.
// → {new Date().getFullYear()}: JavaScript grabs the current year live from the browser
//   clock. This means the footer NEVER needs manual updating each year — no hardcoded
//   "2026" that becomes wrong in 2027.
// → No useState, no hooks, no props: Footer is a fully static component. It receives
//   nothing from its parent (MainLayout) and holds no internal state — it always
//   renders the exact same output. This is intentional and matches the blueprint,
//   which listed no data dependencies.

/** STORY
 * Footer is the "small print near the exit" of the Jiwar shop 🏪 — every physical
 * store has that bottom-of-receipt or near-door text: hours, contact, copyright.
 * Customers rarely read it closely, but it has to be there on every page for trust
 * and legal completeness.
 *
 * Unlike Navbar — which is "alive" and reacts to what the customer is doing
 * (items in cart, logged in or not) — Footer is deliberately "dumb" on purpose.
 * It doesn't care about cart state, auth state, or any store. It just shows the
 * same copyright line no matter who's looking at it or what they're doing.
 *
 * Structurally, Footer lives inside MainLayout.tsx, sitting at the very bottom,
 * below whatever page content ({children}) is currently showing:
 *
 *   MainLayout
 *     ├── Navbar   (top, dynamic)
 *     ├── {children} (page content — Home, Products, etc.)
 *     └── Footer   (bottom, static)
 *
 * No page (HomePage, ProductsPage, etc.) ever imports Footer directly — MainLayout
 * handles that automatically, so every page gets a consistent footer for free,
 * the same way every physical shop branch has the same closing sign near the door.
 */