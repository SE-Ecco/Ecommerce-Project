// WHAT: Yup schema — validation rules for checkout form (address)
// IMPORTS: yup
// USED BY: pages/checkout/CheckoutPage.tsx (via Formik)
// CONTAINS: checkoutSchema
//   - label  (string, required, min 2)
//   - street (string, required, min 5)
//   - city   (string, required, min 2)
//   - phone  (string, required, regex-validated)


// WHAT: Yup schema — validation rules for checkout form (address)
// IMPORTS: yup
// USED BY: pages/checkout/CheckoutPage.tsx (via Formik)

import * as yup from 'yup';

export const checkoutSchema = yup.object({
  label: yup.string().required('Address label is required').min(2, 'Label must be at least 2 characters'),
  street: yup.string().required('Street address is required').min(5, 'Street address must be at least 5 characters'),
  city: yup.string().required('City is required').min(2, 'City must be at least 2 characters'),
  phone: yup.string().required('Phone number is required').matches(/^07\d{9}$/, 'Enter a valid phone number'),
});

// NOTES:
// → import * as yup: same import style used across every validation file in the project — categoryValidation.ts, productValidation.ts, orderValidation.ts
// → checkoutSchema: one exported Yup object schema, plugged into CheckoutPage.tsx's Formik validationSchema prop
// → label: matches the exact field name and purpose from addressService.ts's createAddress() — a short name for the address like "Home" or "Work", required + min(2) blocks empty or meaningless single-character labels
// → street: matches createAddress()'s street field, required + min(5) is a slightly higher floor than label/city because a real street address needs enough characters to actually be deliverable (e.g. "Zakho Road 12" not just "12")
// → city: matches createAddress()'s city field, required + min(2) follows the same simple text-field pattern used for label and category/product names elsewhere
// → phone: matches createAddress()'s phone field, required so it's never blank, .matches() with regex /^07\d{9}$/ enforces the same phone number shape already used in orderValidation.ts's orderHelpSchema — keeps phone validation consistent everywhere in the app instead of having two different rules in two files
// → no shipping_id or any other field was added — ShippingMethod isn't a confirmed type anywhere in types/index.ts yet, so nothing was guessed or invented; schema only covers the 4 fields confirmed directly from addressService.ts's createAddress()

/** STORY
 * checkoutSchema checks the customer's delivery slip before the order goes out — a real label,
 * a real street, a real city, and a real phone number — the same way the delivery boy in Duhok
 * won't leave the shop without a proper address and a number to call if he gets lost.
 */