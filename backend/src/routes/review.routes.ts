import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateMiddleware } from '../middleware/validate.middleware';
import { createReviewValidation } from '../validations/review.validation';
import * as reviewController from '../controllers/review.controller';

const router = Router();

router.get('/product/:id', reviewController.getReviews);
router.post(
    '/',
    authenticate,
    createReviewValidation,  // 🔧 Fix 3: validation added
    validateMiddleware,
    reviewController.createReview
);

export default router;
