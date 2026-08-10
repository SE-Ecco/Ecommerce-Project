// WHAT: Guards routes — redirects if not logged in or wrong role
// IMPORTS: hooks/useAuth, react-router-dom (Navigate, Outlet)
// USED BY: routes/index.tsx (wraps shop_admin and super_admin routes)
// FLOW: not logged in → /login | wrong role → /unauthorized | ok → render page

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


// NOTES:
// → Navigate (react-router-dom): redirects the user without a full page
//   reload — this is the React-way of "send them to another URL." Used
//   twice here: once for /login, once for /unauthorized.
// → Outlet (react-router-dom): a placeholder — "render whatever child
//   route belongs here." ProtectedRoute doesn't know or care which exact
//   page it's guarding (OwnerDashboard vs AdminShops); Outlet is what
//   actually shows that page once checks pass.
// → useAuth (hooks/useAuth): our custom hook — ProtectedRoute pulls
//   isAuthenticated and user from it. Per our rule "components consume
//   hooks, not stores directly," this component never touches authStore
//   itself — all the "how do we know who's logged in" logic stays
//   inside useAuth, one single source of truth.
// → allowedRoles (prop, string[]): passed in from routes/index.tsx per
//   route, e.g. allowedRoles={['shop_admin']} or
//   allowedRoles={['shop_admin', 'super_admin']}. This is what makes
//   ProtectedRoute reusable across every protected route instead of
//   hardcoding role logic inside this file.
// → isAuthenticated check (first if): the FIRST gate — if false, user
//   isn't logged in at all, no point checking roles yet. Redirects to
//   /login with replace so browser "back" button doesn't bounce them
//   back into the protected page they got kicked from.
// → allowedRoles.includes(user!.role) (second if): a MEMBERSHIP check,
//   not exact equality — this is the piece that lets super_admin access
//   shop_admin routes, simply by routes/index.tsx including both roles
//   in that specific route's allowedRoles list. ProtectedRoute itself
//   has no special-casing for super_admin — the flexibility lives in
//   how allowedRoles is passed in.
// → user! (non-null assertion): safe here specifically because the
//   isAuthenticated check above already guarantees user is not null by
//   the time we reach this line — TypeScript can't infer that on its
//   own, so we assert it manually.
// → final return <Outlet />: only reached if BOTH checks passed — this
//   is the "let them through" branch, rendering the actual protected
//   page.
/** STORY
 * 
 * Picture the security guard standing at the door of the mall's
 * staff-only offices in Duhok.
 * 
 * A regular shopper with no badge at all walks up. The guard doesn't
 * even ask which office they want — no badge means no entry, period.
 * "Go get a badge first" → sent straight to /login.
 * 
 * A shopper WITH a badge — but it's a "customer" badge — tries the
 * shop-owner office door. The guard checks it: this badge just isn't
 * valid for this particular door. "Wrong badge for here" → sent to
 * /unauthorized.
 * 
 * A person holding a valid "shop_admin" badge walks up to the
 * shop_admin office. Guard checks the list of badges allowed at this
 * door, sees "shop_admin" is on it, steps aside. They're in.
 * 
 * And here's the nuance that makes this guard smarter than a simple
 * "does your badge say EXACTLY this" check: a super_admin badge should
 * also open shop_admin doors, since super_admin can go anywhere a
 * shop_admin can. The guard doesn't hardcode that exception into his
 * own head though — he just checks "is your badge on TODAY'S allowed
 * list for this door," and it's the mall management (routes/index.tsx)
 * who decides, door by door, which badges make that list.
 * 
 * That's the whole job of this file: two questions, asked in order —
 * "do you have a badge at all?" then "is your badge allowed at THIS
 * door?" — and only if both answers are yes does the guard step aside
 * and let Outlet reveal what's actually behind the door.
 */