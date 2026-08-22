// WHAT: Yup schemas — validation rules for category create/edit
// IMPORTS: yup
// USED BY: pages/owner/OwnerCategories.tsx (via Formik)
// CONTAINS: categorySchema (name — required, min 2 chars)


// WHAT: Yup schemas — validation rules for category create/edit
// IMPORTS: yup
// USED BY: pages/owner/OwnerCategories.tsx (via Formik)

import * as yup from 'yup';

export const categorySchema = yup.object({
  name: yup.string().required('Category name is required').min(2, 'Category name must be at least 2 characters'),
});

// NOTES:
// → import * as yup: brings in the entire Yup library as one object, matches how every other validation file in this project imports it (authValidation.ts, orderValidation.ts) — keeps import style consistent across the team
// → categorySchema: single Yup object schema, exported so OwnerCategories.tsx can plug it straight into Formik's validationSchema prop
// → name field: the only field a category needs — just a display name like "Dairy" or "Bakery"
// → .required(): stops an empty submission before it ever reaches categoryService.ts — no wasted API call for bad data
// → .min(2, ...): blocks single-character or meaningless names; 2 is the same reasonable floor used elsewhere in the project for name-type fields
// → custom error messages: both required() and min() get a specific string instead of Yup's generic default, so OwnerCategories.tsx shows a clear message under the input via Formik's touched+errors check

/** STORY
 * Before a shop owner's new category name ever reaches the backend, categorySchema stands at
 * the door like a manager checking a signboard draft — empty or one-letter names get sent back
 * immediately, so only a real category name like "Bakery" makes it through to be saved.
 */