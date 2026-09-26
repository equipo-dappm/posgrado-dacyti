// ============================================================================
// PUNTO DE ENTRADA DE LA APLICACIÓN
// ============================================================================
// Monta React en el elemento #root, carga los estilos globales
// (tokens de Tailwind + modo nocturno) y renderiza <App />.
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/night-mode.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)