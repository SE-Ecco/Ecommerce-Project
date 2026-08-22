// WHAT: Yup schemas — validation rules for product create/edit form
// IMPORTS: yup
// USED BY: components/product/ProductForm.tsx (via Formik)
// CONTAINS: productSchema (name, description, price, stock, category_id)

// WHAT: Yup schemas — validation rules for product create/edit form
// IMPORTS: yup
// USED BY: components/product/ProductForm.tsx (via Formik)

import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup.string().required('Product name is required').min(2, 'Product name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  price: yup.number().typeError('Price must be a number').required('Price is required').positive('Price must be greater than 0'),
  stock: yup.number().typeError('Stock must be a number').required('Stock is required').integer('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  category_id: yup.string().required('Category is required'),
});

// NOTES:
// → import * as yup: same import style as categoryValidation.ts and every other validation file in the project — keeps the pattern consistent across the team
// → productSchema: one exported Yup object schema, plugged directly into ProductForm.tsx's Formik validationSchema prop
// → name: yup.string() text field, required so it's never blank, min(2) blocks meaningless single-character names — same reasoning as categorySchema.name
// → description: yup.string() text field, required so it's never blank, min(10) is a bigger floor than name because a real product description needs more than one lazy word to actually help a customer decide
// → price: yup.number() switches type from string to number since this is money — typeError() catches someone typing letters into the field, required() catches an empty field, positive() catches zero or negative values so nothing can be listed for free or negative money
// → stock: yup.number() again since it's a count — typeError() and required() work the same as price, integer() specifically blocks decimals like 3.7 since you can't stock a fraction of an item, min(0) allows exactly 0 (sold out is valid) but blocks negative counts like -5
// → category_id: yup.string() required so every product must be linked to a real category — matches how IDs are referenced as strings elsewhere in this stack, prevents a product from floating with no category assigned

/** STORY
 * productSchema acts like a strict inventory manager checking a shop owner's product form
 * before it's accepted — no name too short, no lazy description, no negative or missing price,
 * no fractional stock, and no product allowed onto the shelf without a category to belong to.
 */