// WHAT: Business logic for wishlists — create/list wishlists, add/remove items
// IMPORTS: models/Wishlist-WishlistItem.ts
// USED BY: controllers/wishlist.controller.ts
// ⚠️ SECURITY: WishlistItem has no user_id of its own — ownership is checked
//    by looking up the parent Wishlist first (which DOES have user_id)

import { Wishlist, WishlistItem } from '../models/Wishlist-WishlistItem';

export const createWishlist = async (user_id: number, shop_id: number, name: string) => {
    return await Wishlist.create({ user_id, shop_id, name });
};

export const getWishlists = async (user_id: number, shop_id: number) => {
    return await Wishlist.findAll({
        where: { user_id, shop_id },
        include: [{ model: WishlistItem, as: 'items' }],
    });
};

export const addItemToWishlist = async (wishlist_id: number,user_id: number,product_id: number) => {
    const wishlist = await Wishlist.findOne({ where: { id: wishlist_id, user_id } });
    if (!wishlist) {
        throw new Error('Wishlist not found');
    }

    const existing = await WishlistItem.findOne({
        where: { wishlist_id, product_id },
    });

    if (existing) {
        return existing;
    }

    return await WishlistItem.create({ wishlist_id, product_id });
};

export const removeItemFromWishlist = async (wishlist_id: number,user_id: number,product_id: number) => {
    const wishlist = await Wishlist.findOne({ where: { id: wishlist_id, user_id } });
    if (!wishlist) {
        throw new Error('Wishlist not found');
    }

    const wishlistItem = await WishlistItem.findOne({
        where: { wishlist_id, product_id },
    });
    if (!wishlistItem) {
        throw new Error('Item not found in wishlist');
    }

    await wishlistItem.destroy();
    return { message: 'Item removed from wishlist' };
};

export const deleteWishlist = async (id: number, user_id: number) => {
    const wishlist = await Wishlist.findOne({ where: { id, user_id } });
    if (!wishlist) throw new Error('wishlist not found');
    await wishlist.destroy();
    return { message: 'wishlist deleted successfully' };
};