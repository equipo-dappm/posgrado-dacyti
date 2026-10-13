// ============================================================================
// PUNTO DE ENTRADA DE LA APLICACIÓN
// ============================================================================
// Monta React en el elemento #root, carga los estilos globales (tokens de
// Tailwind + identidad visual UJAT) y renderiza <App />.
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)