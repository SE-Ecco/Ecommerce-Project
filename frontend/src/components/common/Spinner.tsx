// WHAT: Loading spinner — shown while waiting for API responses
// IMPORTS: @mui/material (CircularProgress)
// USED BY: Any page while data is loading
import { CircularProgress } from "@mui/material";

const Spinner = ()=>{
return(
<CircularProgress/>
    );
};
export default Spinner;
/*
const Spinner       → we're naming our component "Spinner"
= () => { }          → this is a function (same shape as Button/Input)
                        empty for now — we'll fill it next
 return (...)  → this is WHERE we put what shows on screen 🖥️
              → right now it's empty
              → next step we'll put <CircularProgress /> inside it
<CircularProgress />  → this IS the spinning circle 🔵
                       → MUI already built the shape + animation for us
                       → we're just placing it on screen
export default Spinner  → allows other files to import "Spinner"
                         → same pattern as Button.tsx and Input.tsx
                         → without this, no other file could use it ❌
*/
//zhegir notes
//this file only include the spinner that when somthing is loadin so that everyone know somthing is running