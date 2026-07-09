// WHAT: Business logic for shops — fetch all shops, fetch shop by slug
// IMPORTS: models/Shop.ts
// USED BY: controllers/shop.controller.ts

import Shop from '../models/Shop'; // Sequelize model — talks to shops table in DB

// ===========================
// GET ALL SHOPS
// ===========================

export const getShopsList = async () => {
  // findAll() → SELECT * FROM shops → returns array of all shop rows
  // no WHERE clause → returns every shop regardless of status
  const shops = await Shop.findAll();
  return shops; // array of Shop objects → controller wraps in successResponse
};

// ===========================
// GET SHOP BY SLUG
// ===========================

export const getShopBySlugFromDB = async (slug: string) => {
  // slug comes from URL → /api/shops/slug/zaytoon-store → slug = "zaytoon-store"
  // findOne() → SELECT * FROM shops WHERE slug = ? → returns ONE shop or null
  const shop = await Shop.findOne({ where: { slug } });
  // { slug } = shorthand for { slug: slug }

  if (!shop) throw new Error('Shop not found');
  // null returned → shop doesn't exist → throw error
  // controller catches it → sends 500 error response to client 🛑

  return shop; // Shop object → controller wraps in successResponse ✅
};

/*
  HOW THIS FILE CONNECTS:
  ─────────────────────────────────────────────────────────────────

  FLOW:
    shop.controller.ts calls getShopsList()
          ↓
    Shop.findAll() → PostgreSQL → returns all rows
          ↓
    controller wraps in successResponse → sends to client ✅

    shop.controller.ts calls getShopBySlugFromDB("zaytoon-store")
          ↓
    Shop.findOne({ where: { slug: "zaytoon-store" } })
          ↓
    found?     → return shop ✅
    not found? → throw "Shop not found" → controller catches → 500 🛑

  EXAMPLE — getShopsList():
  ──────────────────────────
  GET /api/shops
        ↓
  Shop.findAll() → [
    { id: 1, name: "Zaytoon Store", slug: "zaytoon-store", is_active: true },
    { id: 2, name: "Duhok Electronics", slug: "duhok-electronics", is_active: true }
  ] ✅

  EXAMPLE — getShopBySlugFromDB("zaytoon-store"):
  ─────────────────────────────────────────────────
  GET /api/shops/slug/zaytoon-store
        ↓
  Shop.findOne({ where: { slug: "zaytoon-store" } })
        ↓
  found → { id: 1, name: "Zaytoon Store", slug: "zaytoon-store" } ✅

  EXAMPLE — getShopBySlugFromDB("unknown-shop"):
  ────────────────────────────────────────────────
  Shop.findOne({ where: { slug: "unknown-shop" } }) → null
        ↓
  throw new Error('Shop not found') 🛑
  controller catches → 500 { success: false, message: "Shop not found" }
*/