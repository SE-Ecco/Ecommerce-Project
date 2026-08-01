// WHAT: 403 page — shown when user doesn't have the right role
// IMPORTS: @mui/material, react-router-dom
// WHAT: 403 page — shown when a logged-in user tries to access a route
//       their role doesn't have permission for
// IMPORTS: react-router-dom (useNavigate), @mui/material (Box, Typography, Button)
// USED BY: routes/index.tsx — as the target of redirects from ProtectedRoute
//          when a user's role doesn't match what a route requires

import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h1">403</Typography>
      <Typography variant="h5">You don't have permission to view this page</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go back home
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;

// NOTES:
// → useNavigate (react-router-dom): gives us a function to move the user
//   to a different route from inside our code, instead of waiting for
//   them to click a <Link>. We call it here on button click.
//
// → Box (MUI): generic container, like a styled <div>. No layout logic
//   added yet on purpose — you can add flex/centering styling later
//   once you get to the styling pass, without changing the logic.
//
// → Typography (MUI): renders text with consistent design-system sizing.
//   variant="h1" → big bold "403" number, grabs attention immediately
//   variant="h5" → smaller supporting message, explains WHY they're blocked
//
// → Button (MUI): variant="contained" = solid filled background,
//   same visual pattern as your other primary action buttons (Button.tsx)
//
// → onClick={() => navigate('/')}: wrapped in an arrow function on purpose.
//   Writing onClick={navigate('/')} would call navigate() immediately
//   during render (page load), sending the user home instantly instead
//   of waiting for a click — a very common React bug.
//
// → No props needed: this page is 100% static. It doesn't need to know
//   WHO was blocked or WHY — ProtectedRoute already decided that before
//   sending the user here. Keeps this component simple and reusable.

/** STORY
 * Picture the Jiwar mall again 🏢 — every shop has a door with a keycard
 * reader. A customer walks up to the shop_admin's back office door and
 * swipes their customer keycard. The reader beeps red: wrong keycard for
 * this door. A little sign lights up: "403 — You don't have permission
 * to view this page," with a friendly arrow pointing back to the main
 * mall entrance.
 *
 * That's this whole page. It doesn't ask WHY they don't have access, it
 * doesn't check their role, it doesn't even know who they are — that
 * decision already happened at the door (ProtectedRoute). This page's
 * only job is to calmly tell them "not here" and hand them a way back
 * home, instead of leaving them stuck staring at a broken door.
 */