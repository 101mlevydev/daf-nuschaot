import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/app.css'
import { restore, startAutosave } from './lib/persistence.js'

// Restore any saved layout before first paint (no flash), then start autosave.
const restored = restore()
startAutosave()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App initiallyRestored={restored} />
  </StrictMode>
)
