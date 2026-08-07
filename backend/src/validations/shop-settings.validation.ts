import { body } from 'express-validator';

export const updateShopSettingsValidation = [
body('currency')
.optional()
.isString().withMessage('Currency must be text'),

body('language')
    .optional()
    .isString().withMessage('Language must be text'),

body('theme_color')
    .optional()
    .isString().withMessage('Theme color must be text'),

body('meta_title')
    .optional()
    .isString().withMessage('Meta title must be text'),

body('meta_desc')
    .optional()
    .isString().withMessage('Meta description must be text'),
];