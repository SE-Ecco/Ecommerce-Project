import { body } from 'express-validator';

export const createReviewValidation = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    body('orderId')
        .isInt({ min: 1 })
        .withMessage('Valid order ID is required'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .optional()
        .isString()
        .isLength({ max: 255 })
        .withMessage('Comment must be under 255 characters'),
];