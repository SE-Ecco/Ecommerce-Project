// WHAT: Configured Axios instance — base for ALL API calls
// IMPORTS: config/constants.ts (API_BASE_URL, AUTH_TOKEN_KEY)
// USED BY: authService, productService, orderService, shopService, categoryService, userService
// KEY: Auto-attaches JWT token to every request. Redirects to /login on 401.
// WHAT: Configured Axios instance — base URL + Bearer token interceptor
// IMPORTS: config/constants.ts
// USED BY: all service files

import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// auto-attaches Bearer token to every request
// Zustand persist wraps token in { state: { token: '...' } }
// so we need to parse it correctly
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem(AUTH_TOKEN_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // not JSON → use as plain string
      config.headers.Authorization = `Bearer ${stored}`
    }
  }
  return config
})

export default api




// ════════════════════════════════════════════════════
// 📖 THE STORY OF api.ts
// every request your app makes to the backend is like
// mailing a letter 📬 — this file builds the envelope
// system AND hires a guard to protect it
// ════════════════════════════════════════════════════

/*import axios from 'axios';
axios = the postal service that knows how to deliver letters (requests)

const api = axios.create({
  🏠 axios.create() builds a PRE-ADDRESSED ENVELOPE TEMPLATE
   every letter mailed through `api` already has the address on it

  //baseURL: 'http://localhost:5000/api',
  ↑ the shared address written on every envelope automatically
   services only add the ending: '/products', '/orders', '/auth/login'
  instead of typing the FULL url every single time

  headers: {
    'Content-Type': 'application/json'
  }
  // ↑ a stamp on every envelope that tells the backend:
  //   "what's inside this letter is written in JSON language"
});

api.interceptors.request.use((config) => {
   🪪 THE GUARD AT THE DOOR
   before ANY letter leaves the house, the guard stops and checks it
   config = the letter, sealed and sitting on the desk, about to be mailed

  const token = localStorage.getItem('token');
  🔍 guard checks the drawer: "does this person even HAVE a keycard?"
  logged in  → token = a real string (e.g. "eyJhbGc...")
  logged out → token = null (nothing was ever saved)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // 🪪 yes, they have a keycard → guard clips it onto the envelope
    // `Bearer ${token}` = a template string, mixes plain text "Bearer "
    // with the actual token value inserted in the middle
    // backend's auth.middleware.ts looks for EXACTLY this format
  }
  // ❌ no token? → guard shrugs, skips this step
  //   letter goes out with NO keycard attached
  //   that's fine — public letters (like "show me all products")
  //   don't need a keycard to be delivered

  return config;
  // 📮 guard hands the finished, checked letter back
  // NOW axios is allowed to actually mail it
  // forget this line → the letter just sits on the desk forever,
  // nothing gets sent, EVERY request breaks
});

export default api;
// 📦 the whole envelope-factory + guard system gets packaged up
// and shipped out so every other service file can use it

// later, authService.ts / productService.ts / orderService.ts
// will all just say:
//   import api from './api';
//   api.post('/orders', data)
// → already has the address AND the keycard attached, just write the letter ✅
*/
