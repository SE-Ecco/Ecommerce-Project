// WHAT: express-validator rules for order endpoints
// IMPORTS: express-validator (body)
// USED BY: routes/order.routes.ts
// CONTAINS: placeOrderValidation[], updateStatusValidation[]
// FIELDS: items[] (product_id, quantity), address (required)

import { body, param } from 'express-validator';

// ── PLACE ORDER VALIDATION ───────────────────────────────────
// POST /api/orders
export const placeOrderValidation = [
    // WHY: items must exist, be an array, and contain at least 1 element
    // WHY here matters: an order with 0 items makes no business sense
    body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item'),

    // WHY a second body('items') check: .isArray() only checks the ARRAY itself,
    // not what's INSIDE each item — .custom() lets us inspect every element
    body('items').custom((items) => {
        // WHY .every(): loops through ALL items — only passes if EVERY single one is valid
        // (if even ONE item is bad, the whole request should be rejected)
        const valid = items.every((item: any) => {
            return (
                typeof item.product_id === 'number' &&  // WHY: product_id must be a real number, not a string/undefined
                typeof item.quantity === 'number' &&     // WHY: quantity must be a real number too
                item.quantity > 0                        // WHY: can't order 0 or negative quantity — makes no sense
            );
        });

        // WHY throw here (not return false): express-validator's .custom() treats
        // a thrown Error as a validation failure, and uses the Error's message as the error text
        if (!valid) {
            throw new Error('Each item must have a valid product_id and a quantity greater than 0');
        }

        return true; // WHY return true: tells express-validator "this field passed validation"
    }),

    // WHY .optional(): address_id is NOT required — some orders are store pickup, not delivery
    body('address_id').optional().isInt().withMessage('Address ID must be a valid number'),

    // WHY .optional(): notes are always optional — most orders won't include one
    body('notes').optional().isString().withMessage('Notes must be a string'),
];

// ── UPDATE STATUS VALIDATION ─────────────────────────────────
// PATCH /api/orders/:id/status
export const updateStatusValidation = [
    // WHY param() not body(): :id comes from the URL itself, not the request body
    // WHY isInt(): URL params always arrive as strings — must confirm it's really a valid number
    param('id').isInt().withMessage('Order ID must be a valid number'),

    // WHY isIn([...]): status must match EXACTLY one of the ENUM values defined in Order.ts —
    // catching a typo here (e.g. "shiped") BEFORE it ever reaches the database,
    // since the DB would reject an invalid enum value with a much uglier error
    body('status').isIn([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ]).withMessage('Invalid status value.'),
];

/*
    ===========================
    payment transaction
    =========================== 
*/

export const createPaymentTransactionValidation = [
    body('amount')
        .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
        .isString(),
];

export const updatePaymentStatusValidation = [
    body('status')
        .isIn(['completed', 'failed', 'refunded'])
        .withMessage('Status must be completed, failed, or refunded'),
    body('transactionRef')
        .optional()
        .isString(),
];


// ── 🍽️ THE STORY (for teaching the team) ──────────────────
// order.validation.ts = the BOUNCER at the restaurant door 🚪
// checks the customer's order form BEFORE it even reaches the cashier (controller)
//
// "did you actually list items to order?" → items must be a non-empty array
// "is each item real — a real product, a real quantity?" → .custom() checks every item
// "is your delivery address a real number, or empty (pickup)?" → address_id optional
// "did you write your status correctly, no typos?" → isIn() locks it to exact valid words
//
// if ANYTHING is wrong → bounced with a 400 error via validate.middleware.ts
// controller NEVER even runs — invalid data never reaches the chef (service) or fridge (database)