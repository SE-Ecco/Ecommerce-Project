// WHAT: Top navigation bar — logo, shop name, cart icon with count, user menu
// IMPORTS: hooks/useAuth, hooks/useCart, react-router-dom, @mui/material, framer-motion
// USED BY: MainLayout.tsx


import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Link to="/">jiwar</Link>

      <Link to="/cart">
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Link>

      {isAuthenticated ? (
        <span>
          Hi, {user?.name}
          <button onClick={logout}>Logout</button>
        </span>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </motion.nav>
  );
};

export default Navbar;

// ZHEGIR-NOTES: THIS TO WHO READ THIS PLS TALK TO ZHEGIR TO REMEMBER HIM ABOUT THE MOTION SO HE TALK TO JIWAR TO REMEMBER HOW HE WANT
//
// import { Link } from "react-router-dom"
// → React Router's version of <a>. A normal <a href="/cart"> forces the
//   browser to throw away the whole page and reload it from scratch (old
//   HTML way ❌). <Link to="/cart"> intercepts the click and just swaps
//   the matching page component in — no reload, no losing scroll position.
//   This is the actual mechanism behind the SPA concept from Phase D.
//
// import { useAuth } from "../../hooks/useAuth"
// → Custom hook, not the store itself. Reaches into authStore.ts and hands
//   back isAuthenticated, user, and logout. Navbar is NOT allowed to import
//   authStore directly — going through the hook keeps every component
//   using the same clean interface, so if authStore's internals change
//   later, Navbar doesn't need to change at all.
//
// import { useCart } from "../../hooks/useCart"
// → Same pattern as useAuth, but reaches into cartStore.ts. We only pull
//   totalItems here since that's the only cart data Navbar needs — no
//   reason to pull items or totalPrice into a component that doesn't use them.
//
// import { Badge } from "@mui/material"
// → MUI component that wraps any element and overlays a small numbered
//   bubble on its corner. We're using it purely for the cart count — MUI
//   already handles the positioning/styling math for us.
//
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
// → Pre-drawn cart icon from MUI's icon set. Default import (no curly
//   braces) because each MUI icon is its own default export from its own file.
//
// import { motion } from "framer-motion"
// → Lets any normal HTML tag become animatable just by writing motion.
//   in front of it (motion.nav, motion.div, motion.img, etc). Instead of
//   manually writing animation logic frame-by-frame, you give it two
//   snapshots — "initial" (before) and "animate" (after) — and framer-motion
//   calculates every frame in between automatically. Think of it like
//   giving an animator a before-photo and an after-photo and letting them
//   draw the whole motion in between, rather than drawing it yourself.
//
// const { isAuthenticated, user, logout } = useAuth()
// → isAuthenticated: boolean, drives which branch of the ternary renders
// → user: object with logged-in user's info (we only use user.name here)
// → logout: function reference, called (not invoked) inside onClick
//
// const { totalItems } = useCart()
// → number, drives what shows inside the Badge bubble; updates automatically
//   whenever any component calls addItem/removeItem on the cart store
//
// initial={{ y: -50, opacity: 0 }}
// → the SNAPSHOT of how motion.nav looks the instant before animating:
//   y: -50 shifts it 50px above its normal resting spot, opacity: 0
//   makes it fully invisible. This is the starting frame only.
//
// animate={{ y: 0, opacity: 1 }}
// → the SNAPSHOT of how motion.nav should look once settled: y: 0 means
//   back at its normal position (no offset), opacity: 1 means fully
//   visible. The moment the component mounts, framer-motion sees
//   initial ≠ animate and automatically fills in every frame between
//   them — sliding the navbar down while fading it in, with zero manual
//   animation code from us.
//
// <Link to="/">jiwar</Link>
// → logo/home link, plain text for now, can swap in a logo image later
//
// <Link to="/cart"><Badge badgeContent={totalItems} color="error"><ShoppingCartIcon /></Badge></Link>
// → three nested elements, closing in reverse order they opened
//   (Link opens → Badge opens → Icon → Badge closes → Link closes)
// → color="error" is MUI's built-in name for red, used here just for the
//   badge color, nothing to do with an actual error
//
// {isAuthenticated ? (...) : (...)}
// → ternary = inline if/else for JSX; can't use a normal if statement
//   directly inside return(), so this is the standard React pattern
// → user?.name uses optional chaining — if user is null for a split
//   second (e.g. right after logout fires), this prevents a crash
// → onClick={logout} passes the FUNCTION ITSELF as a reference; writing
//   onClick={logout()} would call logout immediately when Navbar renders,
//   logging the user out instantly instead of waiting for a real click ⚠️

/**
 * 🗺️ STORY
 * Navbar is the mall directory sign — no matter which shop (page) the
 * customer walks into, they can always look up and see the same sign:
 * logo, cart, login/logout. It's built once, sits inside MainLayout, and
 * appears identically on every single page in Jiwar.
 *
 * Navbar never stores anything itself. It has no memory of its own state.
 * The cart count comes from useCart, which is really just a hand reaching
 * into cartStore's memory box 🤚📦. The login state comes from useAuth,
 * reaching into authStore the same way. Navbar just displays whatever
 * those two hooks currently hand it, and re-renders automatically the
 * instant that data changes anywhere else in the app.
 *
 * On top of that, motion.nav gives the navbar a small entrance — instead
 * of just popping onto the screen instantly, it slides down from 50px
 * above and fades in, like a shop's awning unrolling as it opens for the
 * day ☂️. Purely visual polish — nothing about the login/cart logic
 * changes because of it.
 *
 * The login/logout section is a simple switch: if isAuthenticated is
 * true, greet the user by name and offer a way out (Logout). If false,
 * offer a way in (Login link). The actual work of checking tokens and
 * clearing sessions happens inside authStore and useAuth, far away from
 * this file.
 */