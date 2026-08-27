// WHAT: Maps category URLs to middleware + controller
// IMPORTS: category.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/categories
// ROUTES:
//   GET    /api/categories?shop_id=1   → getCategories()   (public)
//   POST   /api/categories             → [auth, authorize('shop_admin'), attachShopId] → createCategory()
//   PUT    /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → updateCategory()
//   DELETE /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → deleteCategory()
import { Router, Request, Response, NextFunction } from 'express'
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authorize } from '../middleware/role.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'
import { validateMiddleware } from '../middleware/validate.middleware'
import { createCategoryValidation, updateCategoryValidation } from '../validations/category.validation'
import { upload } from '../middleware/upload.middleware'

const router = Router()

// public — shop_id from query param, no login needed
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const shopId = Number(req.query.shop_id)
  if (!shopId) {
    res.status(400).json({ success: false, message: 'shop_id is required' })
    return
  }
  req.user = { shop_id: shopId } as any
  next()
}, getCategories)

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const shopId = Number(req.query.shop_id)
  if (!shopId) {
    res.status(400).json({ success: false, message: 'shop_id is required' })
    return
  }
  req.user = { shop_id: shopId } as any
  next()
}, getCategoryById)

// protected — must be logged in AND be shop_admin
router.post('/', authenticate, authorize('shop_admin'), shopMiddleware, upload('categories').single('image'), createCategoryValidation, validateMiddleware, createCategory)
router.put('/:id', authenticate, authorize('shop_admin'), shopMiddleware, upload('categories').single('image'), updateCategoryValidation, validateMiddleware, updateCategory)
router.delete('/:id', authenticate, authorize('shop_admin'), shopMiddleware, deleteCategory)
export default router