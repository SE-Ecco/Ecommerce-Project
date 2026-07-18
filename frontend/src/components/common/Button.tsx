// WHAT: Reusable styled button (wraps MUI Button with project theme)
// IMPORTS: @mui/material
// USED BY: Every page and form in the project

import { Button as MuiButton } from '@mui/material';
// renamed the import so it doesn't clash with our own "Button" function below

interface ButtonProps {
  children: React.ReactNode;      // whatever is INSIDE the button (text, icon)
  onClick?: () => void;           // what happens on click
  variant?: 'contained' | 'outlined' | 'text';   // button SHAPE
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; // theme COLOR
  disabled?: boolean;             // is it clickable right now?
  type?: 'button' | 'submit' | 'reset';  // needed for forms (submit buttons)
  fullWidth?: boolean;            // stretch to 100% width
}

function Button({
  children,
  onClick,
  variant = 'contained',   // default: filled/solid button
  color = 'primary',       // default: brand blue
  disabled,
  type = 'button',         // default: NOT a form-submit button
  fullWidth,
}: ButtonProps) {
  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color={color}
      disabled={disabled}
      type={type}
      fullWidth={fullWidth}
    >
      {children}
      {/* everything just passes straight through to MUI's real Button */}
    </MuiButton>
  );
}

export default Button;
// pages import THIS Button, not MUI's directly — keeps one control point

//zhegir notes
//we import MUI
//first of all we call MUI Button as MuiButton to avoid name clash with our own Button function.
//here we make interface cuz its typescript, we define the props that our Button component will accept.
//to avoid confusion, we set default values for variant, color, and type props.
//after making button props and make their rules
//time for the main thing the button function, we destructure the props and pass them to MUI
// here between () we use somthing called destructuring mean when write in that way
//you dont have to write props.children, props.onClick, etc.
// you can just write children, onClick, etc. and it will work the same way.
//we add curly brackets in  meta data so there won't problem because sometimes the value
// won't be string, it can be number or boolean or object, so we use curly brackets to avoid problem
//sometimes when we write the props in in function brackets () we write the key and value ,why?
//sometimes when the response come won't bring for example the color so we will write key with value mean
//when the response come and didn't tell you which color to be, it will auto turn to value we choose it 
/*
import { Button as MuiButton }  → grab MUI's button, rename it so it doesn't
                                   clash with YOUR Button below

interface ButtonProps           → same idea as before, just matches what
                                   MUI's real button supports (shape, color,
                                   form type, full-width)

function Button({...})          → unpack props, give sensible defaults
                                   (contained = filled button, primary = blue)

return <MuiButton ... />        → pass everything straight through to MUI —
                                   your Button is basically a thin "pass-through"
                                   wrapper with your own defaults baked in

export default Button           → so pages import YOUR Button, not MUI's directly
*/