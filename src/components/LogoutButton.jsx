// ============================================================================
// COMPONENTE: BOTÓN DE CIERRE DE SESIÓN
// ============================================================================
// Navega a /login. Aún no invalida ninguna sesión real en el backend.
// ============================================================================

import { useNavigate } from 'react-router-dom'

export default function LogoutButton() {
  const navigate = useNavigate()

  return (
    <button
      className="neumorphic-elevated neumorphic-button px-3 py-2 rounded-full flex items-center gap-2 text-label-md font-label-md font-medium text-primary hover:text-primary-fixed-dim transition-all duration-200"
      type="button"
      aria-label="Cerrar sesión"
      onClick={() => navigate('/login')}
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  )
}