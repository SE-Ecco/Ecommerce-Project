// WHAT: Maps category URLs to middleware + controller
// IMPORTS: category.controller, auth.middleware, role.middleware, shop.middleware
// REGISTERED IN: app.ts as /api/categories
// ROUTES:
//   GET    /api/categories?shop_id=1   → getCategories()   (public)
//   POST   /api/categories             → [auth, authorize('shop_admin'), attachShopId] → createCategory()
//   PUT    /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → updateCategory()
//   DELETE /api/categories/:id         → [auth, authorize('shop_admin'), attachShopId] → deleteCategory()
import { Router } from 'express'
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller'
import { authenticate  } from '../middleware/auth.middleware'
import { shopMiddleware } from '../middleware/shop.middleware'
import { validateMiddleware  } from '../middleware/validate.middleware'
import { createCategoryValidation, updateCategoryValidation } from '../validations/category.validation'
import { upload } from '../middleware/upload.middleware'

const router = Router();

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', authenticate, shopMiddleware, upload('categories').single('image'), createCategoryValidation, validateMiddleware, createCategory)
router.put('/:id', authenticate, shopMiddleware, upload('categories').single('image'), updateCategoryValidation, validateMiddleware, updateCategory)
router.delete('/:id', authenticate, shopMiddleware, deleteCategory)

export default router