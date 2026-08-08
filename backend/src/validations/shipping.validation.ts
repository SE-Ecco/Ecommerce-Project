import { body } from 'express-validator';

export const createShippingMethodValidation = [
  body('name')
    .notEmpty().withMessage('Name is required'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be 0 or more'),

  body('min_days')
    .optional()
    .isInt({ min: 1 }).withMessage('Min days must be at least 1'),

  body('max_days')
    .optional()
    .isInt({ min: 1 }).withMessage('Max days must be at least 1'),
];

export const updateShippingMethodValidation = [
  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
];