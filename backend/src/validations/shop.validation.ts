// WHAT: express-validator rules for shop endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/admin.routes.ts
// CONTAINS: createShopValidation[], updateShopValidation[]
// FIELDS: name, slug (alphanumeric + hyphens), description

import { body } from 'express-validator';

export const createShopValidation = [

  body('name')
    .notEmpty().withMessage('Shop name is required'),

  body('slug')
    .notEmpty().withMessage('slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('slug must be lowercase letters, numbers, and hyphens only'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

];

export const updateShopValidation = [

  body('name')
    .optional()
    .notEmpty().withMessage('Shop name cannot be empty'),

  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/).withMessage('slug must be lowercase letters, numbers, and hyphens only'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

];