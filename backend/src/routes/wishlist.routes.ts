import { Router } from 'express'
import { createWishlist, getWishlists, addItemToWishlist, removeItemFromWishlist, deleteWishlist } from '../controllers/wishlist.controller'
import { authenticate } from '../middleware/auth.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'

const router = Router();

router.post('/', authenticate, shopMiddleware, createWishlist)
router.get('/', authenticate, shopMiddleware, getWishlists)
router.post('/:id/items', authenticate, shopMiddleware, addItemToWishlist)
router.delete('/:id/items', authenticate, shopMiddleware, removeItemFromWishlist)
router.delete('/:id', authenticate, shopMiddleware, deleteWishlist)

export default router