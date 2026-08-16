// WHAT: Register page for new customer accounts
// IMPORTS: formik, validations/authValidation, services/authService, hooks/useAuth
// FIELDS: full_name, email, phone, password, confirmPassword
// FLOW: submit form → call registerService → save to authStore → redirect to home

// a special msg for jiwar from zhegir:jiwar here we dont need to import anything from authservice
//becoase we imported to useAuth.ts the (register) and we completed there so we just need to imported
//from useAuth(), many error were there i was so f ing tired man and u can check the errore

// WHAT: Register page for new customer accounts
// IMPORTS: formik, validations/authValidation, hooks/useAuth
// USED BY: routes/index.tsx (rendered at /register)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { registerSchema } from '../../validations/authValidation';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setSubmitError('');
      try {
        await register(values.full_name, values.email, values.password, values.phone);
        navigate('/');
      } catch (error: any) {
        setSubmitError(error?.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>

        {submitError && (
          <p className="text-red-600 text-sm text-center">{submitError}</p>
        )}

        <Input
          name="full_name"
          label="Full Name"
          value={formik.values.full_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.full_name && formik.errors.full_name)}
          helperText={formik.touched.full_name ? formik.errors.full_name : undefined} // 🔧 fix
        />

        <Input
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email ? formik.errors.email : undefined} // 🔧 fix
        />

        <Input
          name="phone"
          label="Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.phone && formik.errors.phone)}
          helperText={formik.touched.phone ? formik.errors.phone : undefined} // 🔧 fix
        />

        <Input
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password ? formik.errors.password : undefined} // 🔧 fix
        />

        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined} // 🔧 fix
        />

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full"
        >
          {formik.isSubmitting ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
    </div>
  );
}

// NOTES:
// → useState: tracks submitError, shown if the backend rejects registration
//   (e.g. "email already exists"). Cleared at the start of every submit.
// → useNavigate: redirects to '/' (HomePage) after successful registration.
// → useFormik: manages all 5 field values, touched state, and validation.
// → registerSchema (authValidation.ts): the real exported name — checks
//   full_name, email format, password length. Note: as of now it does NOT
//   check confirmPassword matches password — that's a gap to fix later.
// → useAuth's register(): NOT authService directly. This function already
//   calls authService.register() internally AND calls setAuth() to save the
//   user + token into authStore — RegisterPage never touches authService or
//   setAuth directly, keeping the "components use hooks, not services/stores"
//   rule intact.
// → register() takes 4 positional args (full_name, email, password, phone)
//   in that exact order — not one values object — matching its real signature.
// → Input / Button: reused from components/common, never raw HTML tags.
// → error={!!(...)}: forces a real boolean. formik.touched.X && formik.errors.X
//   can return a string (the error message) instead of true/false, which
//   breaks Input's expected boolean prop — the !! converts it safely.
// → try/catch: navigate('/') only runs on success. If register() throws
//   (bad network, backend rejection), we land in catch with an error message
//   shown, and the customer stays on the page, not logged in.

/** STORY
 * RegisterPage is the mall's front-desk sign-up counter: a new visitor fills
 * out their details, Yup double-checks the form before it's handed to the
 * front desk clerk (useAuth's register), who both books the visitor with the
 * registration office AND hands them their keycard in one motion — no
 * separate stop needed, they walk straight into the mall already recognized.
 */
