// WHAT: Yup schemas — validation rules for checkout form
// IMPORTS: yup
// USED BY: pages/checkout/CheckoutPage.tsx (via Formik)
// CONTAINS: checkoutSchema (address — required, min length)


import * as yup from 'yup';

export const orderHelpSchema = yup.object({
  order_id: yup.string().required('Please select an order'),
  reason: yup
    .string()
    .oneOf(['wrong_item', 'damaged', 'refund', 'other'], 'Please select a valid reason')
    .required('Please select a reason'),
  message: yup
    .string()
    .min(10, 'Please describe the issue in at least 10 characters')
    .required('Please describe the issue'),
  phone: yup
    .string()
    .matches(/^[0-9+\s-]{7,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
});

// NOTES:
// → yup.object({...}): wraps all 4 field rules into one schema object, the
//   same pattern used by registerSchema in authValidation.ts — Formik reads
//   this whole object to validate the form on every change/blur/submit.
// → order_id: a required string. In the actual form this will likely be
//   filled automatically (e.g. customer clicks "Need Help" on a specific
//   OrderCard) rather than typed manually, but it's still validated in case
//   it's ever missing or lost during state handling.
// → reason: locked to 4 exact values via .oneOf() — matches the dropdown
//   options (wrong_item, damaged, refund, other). This protects against a
//   dropdown bug or manual state tampering sending an unexpected string.
// → message: has a minimum length of 10 characters so customer service
//   actually receives something useful, not a one-word submission. No max
//   length set here — customers describing a real problem may need space,
//   but this can be added later if backend requires a cap.
// → phone: validated with a regex allowing digits, +, spaces, and dashes,
//   7 to 15 characters long. This is intentionally loose (not tied to one
//   country's format) since Duhok customers may write numbers with or
//   without a country code or spacing.
// → All 4 fields are required — customer service can't act on a help
//   request missing any of: which order, why, what happened, or how to
//   reach the customer back.

/** STORY
 * orderHelpSchema is the mall's customer service complaint counter — before
 * a shopper's "I have a problem" note gets handed to staff, this checkpoint
 * makes sure they've named the purchase, picked a real reason, explained
 * enough to be useful, and left a number to be called back on.
 */