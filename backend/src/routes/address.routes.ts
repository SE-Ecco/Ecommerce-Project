import { Router } from 'express'
import { createAddress, getAddresses, updateAddress, deleteAddress } from '../controllers/address.controller'
import { authenticate } from '../middleware/auth.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'

const router = Router();

router.post('/', authenticate, shopMiddleware, createAddress)
router.get('/', authenticate, shopMiddleware, getAddresses)
router.put('/:id', authenticate, shopMiddleware, updateAddress)
router.delete('/:id', authenticate, shopMiddleware, deleteAddress)

export default router
