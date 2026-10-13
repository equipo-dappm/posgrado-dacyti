// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================
// Define el routing de React Router. "/" redirige a la página de login y el
// inicio del sistema es la selección de programas.
//
//   /                  -> redirige a /login
//   /login             -> LoginPage (autenticación)
//   /inicio            -> redirige a /programas (inicio del sistema)
//   /programas         -> SelectorPrograma (inicio)
//   /programas/:clave  -> ListaAlumnos (alumnos de un programa)
//   /nuevo-alumno      -> NuevoAlumno (vista previa de alta)
// ============================================================================

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ListaAlumnos from './pages/ListaAlumnos.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NuevoAlumno from './pages/NuevoAlumno.jsx'
import SelectorPrograma from './pages/SelectorPrograma.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inicio" element={<Navigate to="/programas" replace />} />
        <Route path="/programas" element={<SelectorPrograma />} />
        <Route path="/programas/:clave" element={<ListaAlumnos />} />
        <Route path="/nuevo-alumno" element={<NuevoAlumno />} />
      </Routes>
    </BrowserRouter>
  )
}