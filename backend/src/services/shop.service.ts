// WHAT: Business logic for shops — fetch all shops, fetch shop by slug
// IMPORTS: models/Shop.ts
// USED BY: controllers/shop.controller.ts

import Shop from '../models/Shop';
import sequelize from '../config/database';
import { User } from '../models';

// ===========================
// GET ALL SHOPS
// ===========================

export const getShopsList = async () => {
      const shops = await Shop.findAll();
      return shops;
};

// ===========================
// GET SHOP BY SLUG
// ===========================

export const getShopBySlugFromDB = async (slug: string) => {
      const shop = await Shop.findOne({ where: { slug } });
      if (!shop) throw new Error('Shop not found');
      return shop;
};

// ===========================
// GET SHOP BY ID
// ===========================

export const getShopByIdFromDB = async (id: number) => {
      const shop = await Shop.findByPk(id);
      if (!shop) throw new Error('Shop not found');
      return shop;
};

export const updateShopStatus = async (
      shopId: number,
      status: 'active' | 'inactive' | 'suspended'
) => {
      const shop = await Shop.findByPk(shopId);
      if (!shop) throw new Error('Shop not found');
      shop.set('status', status);
      await shop.save();
      return shop;
}
/* 
═══════════════════════════════════════════════════════════════
 📌 WHY THIS FUNCTION WAS ADDED (for the team):
 ═══════════════════════════════════════════════════════════════
 admin.controller.ts needs to activate/suspend shops (super_admin power),
 but our project RULE says: "controllers call services, not models directly"
 (see project-structure.md → Key Rules to Remember)

 admin.controller.ts has NO admin.service.ts of its own — by design,
 it reuses EXISTING services instead of duplicating logic.

 so instead of admin.controller.ts doing:
   ❌ await Shop.update({ is_active: false }, { where: { id } })  ← breaks the rule, model touched directly

 we added updateShopStatus() HERE in shop.service.ts, so both:
   ✅ shop.controller.ts   → can use shop logic for normal shop owners
   ✅ admin.controller.ts  → can reuse the SAME function for admin actions

 keeps ALL shop-related database logic in ONE place (shop.service.ts),
 instead of scattering Shop.update() calls across multiple controllers
 ═══════════════════════════════════════════════════════════════
*/

export const createShop = async (
      shopData: {
            name: string;
            slug: string;
            status: 'active' | 'inactive' | 'suspended';
      },
      adminUserId: number
) => {
      const transaction = await sequelize.transaction();
      try {
            const newShop = await Shop.create(
                  {
                        name: shopData.name,
                        slug: shopData.slug,
                        status: shopData.status,
                  },
                  { transaction }
            );
            // 2️⃣ find the user who will become this shop's admin
            const user = await User.findByPk(adminUserId, { transaction });
            if (!user) throw new Error('Admin user not found');

            // 3️⃣ link the user to the new shop + promote their role
            user.set('shop_id', newShop.get('id'));
            user.set('role', 'shop_admin');
            await user.save({ transaction });

            // 4️⃣ commit — shop + user update both succeeded
            await transaction.commit();
            return newShop;
      } catch (error) {
            await transaction.rollback();
            throw error;
      }
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

