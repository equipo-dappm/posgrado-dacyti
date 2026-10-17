// ============================================================================
// COMPONENTE: APLICACIÓN LAYOUT
// ============================================================================
// Estructura base de las páginas internas: barra lateral de navegación con la
// identidad UJAT (Verde institucional) a la izquierda y el contenido
// (children) al centro.
// ============================================================================

import { useLocation, useNavigate } from 'react-router-dom'
import LogoutButton from './LogoutButton.jsx'

// --- Ítems del menú lateral ------------------------------------------------
// "Reportes" es un marcador de posición (sin ruta aún).
const NAV_ITEMS = [
  { label: 'Programas', to: '/programas' },
  { label: 'Nuevo alumno', to: '/nuevo-alumno' },
  { label: 'Reportes' },
]

// Indica si un ítem del menú corresponde a la ruta actual.
function isActive(item, pathname) {
  if (item.to === '/programas') return pathname === '/programas' || pathname.startsWith('/programas/')
  if (item.to === '/nuevo-alumno') return pathname === '/nuevo-alumno'
  return false
}

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="bg-background text-on-background min-h-screen flex font-body-md">
      {/* Barra lateral: Verde institucional 1 (color predominante) */}
      {/* Se mantiene visible (sticky) mientras el contenido de la página scrollea de forma independiente */}
      <aside className="sticky top-0 z-10 h-[100dvh] w-[240px] flex-shrink-0 bg-ujat-verde-1 text-white flex flex-col">
        <div className="px-6 py-5">
          <div className="text-lg font-bold leading-tight">Posgrado DACYTI</div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-white/70 mt-1">
            UJAT
          </div>
        </div>
        {/* Franja de los tres verdes institucionales */}
        <div className="ujat-stripe" />

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <button
                key={item.label}
                className={`w-full text-left px-4 py-3 text-sm rounded-lg border-l-4 transition-colors ${
                  isActive(item, pathname)
                    ? 'bg-white/15 border-ujat-verde-3 text-white font-semibold'
                    : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                type="button"
                onClick={() => navigate(item.to)}
              >
                {item.label}
              </button>
            ) : (
              <div
                key={item.label}
                className="px-4 py-3 text-left text-sm rounded-lg border-l-4 border-transparent text-white/45 cursor-default"
              >
                {item.label}
              </div>
            )
          )}
        </nav>

        {/* Cierre de sesión */}
        <div className="p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Contenido de la página */}
      <main className="flex-1 min-w-0 px-8 lg:px-10 py-8">{children}</main>
    </div>
  )
}
