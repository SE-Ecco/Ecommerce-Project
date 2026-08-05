import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as reviewController from '../controllers/review.controller';

const router = Router();

router.get('/product/:id', reviewController.getReviews);
router.post('/', authenticate, reviewController.createReview);

export default router;