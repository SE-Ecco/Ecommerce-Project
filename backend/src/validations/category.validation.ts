// WHAT: express-validator rules for category endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/category.routes.ts
// CONTAINS: createCategoryValidation[], updateCategoryValidation[]
// FIELDS: name (required, min 2)
import { body } from 'express-validator';

export const createCategoryValidation = [

  body('name')
    .notEmpty().withMessage('Category name is required'),

  body('slug')
    .notEmpty().withMessage('slug is required'),

];

export const updateCategoryValidation = [

  body('name')
    .optional()
    .notEmpty().withMessage('Category name cannot be empty'),

  body('slug')
    .optional()
    .notEmpty().withMessage('slug is required'),

];