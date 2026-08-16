// WHAT: Reusable form input (wraps MUI TextField)
// IMPORTS: @mui/material
// USED BY: Login form, Register form, Product form
import { TextField } from '@mui/material';
// MUI's TextField already handles labels, borders, focus states, error styling

interface InputProps {
  label: string;                  // text shown above/inside the field
  name: string;                   // matches the Formik field name (e.g. "email")
  value: string;                  // current typed value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  // fires on every keystroke
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;          // fires when user clicks AWAY (Formik uses this to validate)
  error?: boolean;                // true = show red error styling
  helperText?: string;            // the actual error message text (e.g. "Email is required")
  type?: string;                  // "text" | "email" | "password" etc.
}

function Input({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = 'text',       // default: normal text field
}: InputProps) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      type={type}
      fullWidth
      // fullWidth is hardcoded (not a prop) — every input in this project
      // should stretch full width, no exceptions needed yet
    />
  );
}

export default Input;

//zhegir notes
//we import MUI's TextField component, which already handles labels, borders, focus states, and error styling.
//we define an interface InputProps to specify the props that our Input component will accept.
//we set default value for the type prop to 'text' to avoid confusion.
