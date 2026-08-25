// WHAT: Custom hook that fetches product data for a page/component to display
// IMPORTS: useState (React), getProducts (productService), Product (types)
// USED BY: ProductsPage.tsx, ProductGrid.tsx, OwnerProducts.tsx (any place showing products)

import { useState } from 'react';
import { getProducts } from '../services/productService';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
}

// NOTES:
// → useState (React) — creates three independent pieces of local state: the product
//   list itself, a loading flag, and an error message. Local state here (not a store)
//   because this data is fetched per-page, not shared globally across the app.
//
// → getProducts (productService) — the exact named export from productService.ts.
//   Takes no params, hits GET /products, returns Product[] already unwrapped from
//   response.data.data. This hook doesn't know or care about axios/URLs — that's the
//   service's job. Hook only orchestrates WHEN to call it and tracks the result.
//
// → Product (types) — typing products as Product[] instead of any[] means any
//   component destructuring `products` gets full autocomplete + type safety on fields
//   like name, price, stock, etc.
//
// → fetchProducts() — the single function a component calls (usually inside a
//   useEffect on page load) to trigger the fetch. setLoading(true) and setError(null)
//   run BEFORE the request so the UI can show a fresh "loading..." state and clear
//   any stale error from a previous failed attempt.
//
// → try/catch/finally — try attempts the real fetch and saves data on success.
//   catch only fires on failure (network down, 500, etc.) and sets a plain error
//   message — we don't leak raw error objects to the UI. finally always runs last,
//   guaranteeing loading flips back to false whether the fetch succeeded or failed.
//
// → return { products, loading, error, fetchProducts } — this is the "menu" the hook
//   hands to any component: the data, two status flags to drive UI (spinner / error
//   message), and the trigger function itself. Components never touch productService
//   directly — they only ever go through this hook. Matches useAuth's pattern of
//   returning a clean object instead of raw state setters.

/** STORY
 * useProducts is the inventory clerk of the Jiwar mall. A page (ProductsPage,
 * OwnerProducts) doesn't walk into the warehouse itself — it asks the clerk for
 * "today's product list." The clerk goes to productService, fetches the real data,
 * keeps track of whether they're still checking (loading) or something went wrong
 * (error), and hands back a clean, ready-to-display list. Any page that needs
 * products asks the same clerk instead of learning how the warehouse works.
 */