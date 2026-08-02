// WHAT: 404 page — shown when URL doesn't match any route
// IMPORTS: framer-motion, @mui/material, react-router-dom
// USED BY: routes/index.tsx (catch-all "*" route)

import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '6rem', color: 'primary.main' }}>
          404
        </Typography>
      </motion.div>
      <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Link to="/">
        <Button variant="primary">Go Back Home</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;

// NOTES:
// → Link (react-router-dom): navigates to "/" without a full page reload — the whole reason we don't use a plain <a href>
// → Button (components/common): reusing YOUR existing component instead of a raw <button>, so styling stays consistent everywhere. Double-check "primary" matches the actual variant prop name in your Button.tsx
// → motion (framer-motion): wraps the "404" text so it fades + slides in on page load instead of popping in instantly
// → Box (MUI): flex container — minHeight: '100vh' fills the full screen, flexDirection: 'column' stacks children vertically, alignItems + justifyContent: 'center' centers everything both horizontally and vertically
// → Typography (MUI): three different variants used —
//     h1 (huge, for "404" itself, color overridden to theme's primary color)
//     h5 (subtitle, "Page Not Found")
//     body1 (small gray paragraph, the explanation sentence)
// → sx prop: MUI's inline styling shorthand — mt/mb/px use MUI spacing units (1 unit = 8px)
// → px: 2 on the outer Box: adds left/right padding so the text doesn't touch screen edges on small phones

/** STORY
 * Think of NotFoundPage like the directory sign at the entrance of Jiwar's mall.
 * A customer types a URL that doesn't exist — like walking up to "Store #99"
 * that was never built. Instead of leaving them standing there confused,
 * this page gently animates in with a big "404", a friendly explanation,
 * and one clear button: "Go Back Home." One click, and Router teleports
 * them straight back to "/" — no reload, no dead end, no lost customer.
 */