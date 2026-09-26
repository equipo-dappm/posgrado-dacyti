// ============================================================================
// COMPONENTE: APLICACIÓN LAYOUT
// ============================================================================
// Estructura base de las páginas internas: barra lateral de navegación
// (neumórfica) a la izquierda y el contenido (children) al centro.
// ============================================================================

import { useLocation, useNavigate } from 'react-router-dom'
import LogoutButton from './LogoutButton.jsx'
import ThemeToggle from './ThemeToggle.jsx'

// --- Ítems del menú lateral ------------------------------------------------
// "Seguimientos" y "Reportes" son marcadores de posición (sin ruta aún).
const NAV_ITEMS = [
  { label: 'Alumnos', to: '/inicio' },
  { label: 'Programas', to: '/programas' },
  { label: 'Seguimientos' },
  { label: 'Reportes' },
]

// Indica si un ítem del menú corresponde a la ruta actual.
function isActive(item, pathname) {
  if (item.to === '/inicio') return pathname === '/inicio'
  if (item.to === '/programas') return pathname === '/programas' || pathname.startsWith('/programas/')
  return false
}

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="bg-[#e0e5ec] text-on-background min-h-screen flex font-body-md transition-colors duration-300">
      {/* Barra lateral */}
      <aside className="w-[220px] flex-shrink-0 my-4 ml-4 p-4 neumorphic-elevated rounded-xl flex flex-col gap-[10px]">
        <div className="font-semibold text-[15px] px-2 pb-5 text-on-background">Posgrado DACYTI</div>
        <div className="flex flex-col gap-[10px]">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <button
                key={item.label}
                className={`px-[16px] py-3 text-left text-sm cursor-pointer transition-colors ${
                  isActive(item, pathname)
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
                type="button"
                onClick={() => navigate(item.to)}
              >
                {item.label}
              </button>
            ) : (
              <div key={item.label} className="px-[16px] py-3 text-left text-sm text-on-surface-variant">
                {item.label}
              </div>
            ),
          )}
        </div>
        {/* Controles de tema/cierre de sesión solo en el dashboard */}
        {pathname === '/inicio' && (
          <div className="mt-auto flex flex-col items-start gap-3 pt-6">
            <ThemeToggle />
            <LogoutButton />
          </div>
        )}
      </aside>
      {/* Contenido de la página */}
      <main className="flex-1 min-w-0 px-8 lg:px-10 py-8">{children}</main>
    </div>
  )
}