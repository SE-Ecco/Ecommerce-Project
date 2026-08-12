// WHAT: Entry point — mounts React app into index.html <div id="root">
// IMPORTS: App.tsx, global.css
// USED BY: Nothing — this is where everything starts
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)