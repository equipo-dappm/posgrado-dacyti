// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================
// Define el routing de React Router. "/" redirige a la página de login.
//
//   /                  -> redirige a /login
//   /login             -> LoginPage (autenticación)
//   /inicio            -> Dashboard (panel principal)
//   /programas         -> SelectorPrograma (elegir programa)
//   /programas/:clave  -> ListaAlumnos (alumnos de un programa)
// ============================================================================

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import ListaAlumnos from './pages/ListaAlumnos.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SelectorPrograma from './pages/SelectorPrograma.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inicio" element={<Dashboard />} />
        <Route path="/programas" element={<SelectorPrograma />} />
        <Route path="/programas/:clave" element={<ListaAlumnos />} />
      </Routes>
    </BrowserRouter>
  )
}