// WHAT: Root component — wraps everything in MUI theme + React Router
// IMPORTS: routes/index.tsx, theme/index.ts, MUI ThemeProvider
// USED BY: main.tsx
// WHAT: Root component — sets up Router + Theme + global providers
// IMPORTS: React Router, MUI Theme, routes
// USED BY: main.tsx

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/index'
import AppRoutes from './routes/index'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App