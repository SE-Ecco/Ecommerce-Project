// WHAT: Global auth state — logged in user + token, persisted in localStorage
// IMPORTS: zustand, zustand/middleware (persist), types/index.ts, config/constants.ts
// USED BY: hooks/useAuth.ts (which is used by every component that needs user info)
// CONTAINS: user, token, isAuthenticated, setAuth(), logout()

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { AUTH_TOKEN_KEY } from '../config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: AUTH_TOKEN_KEY,
    }
  )
);

// NOTES:
// → create: core Zustand function, builds the store itself
// → persist: middleware wrapper — automatically mirrors store state to localStorage
//   so login survives a page refresh
// → User: imported type describing the shape of a logged-in user object
//   from types/index.ts
// → AUTH_TOKEN_KEY: the constant used as the localStorage key name — same constant
//   already used in api.ts, keeps naming consistent (avoids the string-literal
//   bug caught back in Phase 0.5)
// → AuthState interface: describes the full shape of the store — 3 data fields
//   (user, token, isAuthenticated) + 2 action functions (setAuth, logout)
// → user: User | null — null means nobody is logged in yet
// → token: string | null — the JWT, null before login
// → isAuthenticated: boolean — quick flag so components don't need to write
//   `user !== null` everywhere
// → setAuth(user, token): called right after a successful login API response;
//   updates all 3 fields in one set() call, triggering React to re-render
//   every component subscribed via useAuth()
// → logout(): resets all 3 fields back to empty/false — clears both the
//   Zustand state AND (via persist) the localStorage copy
// → { name: AUTH_TOKEN_KEY }: persist's config — tells it which key name
//   to use when writing this store's data into localStorage

/** STORY
 * authStore is Jiwar's membership card system 🏪.
 *
 * Before anyone logs in, the store is just an empty front desk —
 * no user, no token, isAuthenticated is false.
 *
 * When a customer logs in successfully, LoginPage calls setAuth(user, token).
 * That's the moment the front desk stamps their membership card and files it.
 * Every component in the app — Navbar, ProtectedRoute, Sidebar — can now
 * walk up to this same front desk (via useAuth) and instantly see:
 * "yes, this person is a member, here's their name, here's their role."
 *
 * Because Zustand is reactive, the moment setAuth() runs, EVERY component
 * watching the store automatically updates — Navbar flips from "Login" to
 * the user's name with zero manual refresh.
 *
 * The persist wrapper is like the front desk also keeping a backup copy
 * of every membership card in a filing cabinet (localStorage). So even if
 * the shop closes and reopens (page refresh), the front desk doesn't
 * forget who was already a member — it reloads the cards from the cabinet.
 *
 * logout() is tearing up the card — both the front desk's live memory
 * AND the filing cabinet copy get cleared at once.
 */