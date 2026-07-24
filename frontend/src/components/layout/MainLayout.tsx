// WHAT: Wraps all customer-facing pages — adds Navbar on top + Footer on bottom
// IMPORTS: Navbar.tsx, Footer.tsx, react-router-dom (Outlet)
// USED BY: routes/index.tsx (for public shop routes)
// <Outlet /> is where the page content renders

import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;

// NOTES:
// → Outlet (react-router-dom): the placeholder slot where React Router injects
//   whichever page component matches the current URL (HomePage, ProductsPage, CartPage, etc).
//   Without it, MainLayout would have no way to show page-specific content.
// → Navbar: imported and placed OUTSIDE the Outlet, so it stays mounted and
//   never re-renders when the URL changes — this is what makes navigation feel instant (SPA behavior).
// → Footer: same idea as Navbar — fixed, always present, outside the Outlet.
// → min-h-screen: ensures the outer div is always at least the full viewport height,
//   so short pages don't leave a weird gap below the footer.
// → flex flex-col: stacks Navbar, main, and Footer vertically instead of side-by-side.
// → main className="flex-grow": the KEY piece that pushes Footer to the bottom of the
//   screen even when page content is short. Without flex-grow, Footer would float
//   right under the content on short pages instead of sticking to the bottom.
// → export default: allows routes/index.tsx to import MainLayout and wrap
//   all public shop routes with it.

/**
 * STORY:
 * Think of MainLayout as the shopping mall building itself 🏬 — the entrance
 * sign (Navbar) and the exit/info desk (Footer) never move, no matter which
 * shop a customer walks into. The shops inside (HomePage, ProductsPage,
 * CartPage) are what change — and Outlet is the empty storefront slot that
 * gets filled with whichever shop matches where the customer currently is.
 * Because Navbar and Footer sit OUTSIDE that slot, they never rebuild when
 * the customer walks from one shop to another — only the inside changes.
 * That's the SPA promise from Phase D, now made real in actual code.
 */