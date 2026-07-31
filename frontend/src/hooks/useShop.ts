// WHAT: Simplifies reading the currently viewed shop
// IMPORTS: store/shopStore.ts
// USED BY: pages/shop/ProductsPage, components/layout/Navbar
// RETURNS: currentShop, setShop, clearShop, isLoaded
import {useShopStore} from '../store/shopStore'
export const useShop = () => {
    const { currentShop , isLoaded , setShop , clearShop }=useShopStore()
    return{
        currentShop,
        isLoaded,
        setShop,
        clearShop,
    }
}

// NOTES:
// → useShopStore: the only import this hook needs — shopStore already holds
//   currentShop, isLoaded, and the two actions (setShop, clearShop), so this
//   hook doesn't create any new state, it just repackages what's already there
// → const { currentShop, isLoaded, setShop, clearShop } = useShopStore():
//   calling the store with no selector returns the whole store object, then
//   destructuring pulls out exactly those 4 fields — nothing extra
// → unlike useAuth (which calculates role flags) or useCart (which calculates
//   totals), useShop has NO derived/calculated values — the RETURNS list in
//   the blueprint is identical to what's already sitting in the store, so this
//   hook is a pure pass-through, just a clean access point instead of
//   components importing useShopStore directly everywhere
// → currentShop being null vs a shop object also tells components whether
//   they're "inside a shop" or not (e.g. Navbar can conditionally show
//   "You're viewing: [Shop Name]" only when currentShop is not null)
// → because shopStore has no persist middleware, currentShop always reflects
//   the CURRENT page/URL only — a refresh resets it to null, and ProductsPage
//   is responsible for calling setShop() again after fetching fresh data
//   from the backend based on the URL slug

/** STORY
 * shopStore.ts is the "You Are Here" 📍 sign at the Jiwar mall directory —
 * it only ever shows whichever shop the customer is currently standing in
 * front of. There's no filing cabinet backing it up; it's a live display,
 * not a memory.
 *
 * useShop.ts is simply the glass case around that sign. Any component
 * walking by — ProductsPage, Navbar — looks through the glass and reads
 * exactly what's printed, no interpretation needed, no extra math like
 * useAuth's role checks or useCart's totals. It just presents currentShop
 * and isLoaded as-is.
 *
 * Refresh the page (walk away and come back), and the sign resets to
 * blank — because nothing was ever filed away. It's ProductsPage's job
 * to look at the URL slug, ask the backend "which shop is this?", and
 * call setShop() to reprint the sign fresh, every single time.
 */