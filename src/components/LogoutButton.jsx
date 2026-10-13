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
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white text-label-md font-label-md font-medium transition-colors"
      type="button"
      aria-label="Cerrar sesión"
      onClick={() => navigate('/login')}
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span>Cerrar sesión</span>
    </button>
  )
}
