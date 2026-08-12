// WHAT: MUI theme configuration — colors, typography, component overrides
// IMPORTS: @mui/material (createTheme)
// USED BY: App.tsx (ThemeProvider)
// CONTAINS: primary/secondary colors, typography (font family), component defaults
// CUSTOMIZE: Change colors here to match your brand — affects entire app
// WHAT: MUI theme configuration
// USED BY: App.tsx

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})