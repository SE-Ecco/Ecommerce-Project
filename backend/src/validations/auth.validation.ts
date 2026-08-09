// WHAT: Validation rules for auth endpoints using express-validator
// WHY:  Catch bad data BEFORE it reaches the controller — fail fast, clear errors
// USED BY: routes/auth.routes.ts (runs before controller)

import { body } from 'express-validator'; // body() = validates fields from req.body

/*
    Before anyone enters, he checks:
    "do you have an ID?"            → notEmpty()
    "is your ID real email format?" → isEmail()
    "is your password long enough?" → isLength({ min: 6 })
    _______________________________________________________
    if any rule fails
        bouncer says "you can't enter!" 🛑
        sends them back with reason why
        "email is not valid"
        "password too short"
        "name is required"
*/

// registerValidation = array of rules that run one by one on POST /api/auth/register
export const registerValidation = [

  body('full_name')
    .notEmpty().withMessage('Full name is required'), // rejects empty or missing full_name

  body('email')
    .notEmpty().withMessage('Email is required')      // rejects empty or missing email
    .isEmail().withMessage('Email must be valid'),    // rejects "notanemail" format

  body('password')
    .notEmpty().withMessage('Password is required')   // rejects empty or missing password
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'), // rejects "abc123"

];

// loginValidation = array of rules that run one by one on POST /api/auth/login
export const loginValidation = [

  body('email')
    .notEmpty().withMessage('Email is required')      // rejects empty or missing email
    .isEmail().withMessage('Email must be valid'),    // rejects "notanemail" format

  body('password')
    .notEmpty().withMessage('Password is required'),  // rejects empty or missing password
    // no isLength here — wrong password gives better error from service, not validation

];

/*
  HOW THIS FILE WORKS:
  ─────────────────────────────────────────────────────────────────

  body('field')  → selects which field from req.body to validate
  .notEmpty()    → field must exist and not be empty string
  .isEmail()     → field must match email format (x@x.x)
  .isLength()    → field must meet length requirement
  .withMessage() → custom error message when rule fails

  FLOW IN THE PROJECT:
  request hits POST /api/auth/register
        ↓
  registerValidation rules run → check each field
        ↓
  validate.middleware calls validationResult(req)
        ↓
  errors found?  → return 400 with error messages 🛑
  no errors?     → pass to auth.controller ✅

  EXAMPLE — register request with bad data:
  ─────────────────────────────────────────
  POST /api/auth/register
  body: {
    full_name: "",           ← empty!
    email: "notanemail",     ← wrong format!
    password: "123"          ← too short!
  }

  validation catches all 3 errors → returns:
  {
    errors: [
      { field: "full_name", message: "Full name is required" },
      { field: "email",     message: "Email must be valid" },
      { field: "password",  message: "Password must be at least 8 characters" }
    ]
  }
  controller never runs! 🛑 clean and safe ✅

  EXAMPLE — register request with good data:
  ───────────────────────────────────────────
  POST /api/auth/register
  body: {
    full_name: "Alan",
    email: "alan@gmail.com",
    password: "mypassword123"
  }

  all rules pass → validate.middleware says OK
  → auth.controller.register() runs ✅
*/
