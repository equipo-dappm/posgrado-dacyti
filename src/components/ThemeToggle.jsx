// ============================================================================
// COMPONENTE: INTERRUPTOR DE TEMA CLARO/OSCURO
// ============================================================================
// Alterna la clase "dark" en el elemento <html>, que activa el modo
// nocturno definido en src/styles/night-mode.css.
// ============================================================================

import { useState } from 'react'

export default function ThemeToggle() {
  // Estado inicial: lee si el tema oscuro ya está activo en <html>.
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )

  // Alterna la clase "dark" y actualiza el estado local.
  const handleToggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    setDark(next)
  }

  return (
    <button
      className="w-16 h-8 rounded-full bg-[#e0e5ec] dark:bg-background neumorphic-sunken relative flex items-center p-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
      type="button"
      aria-label="Cambiar modo claro/oscuro"
      onClick={handleToggle}
    >
      <div
        className={`w-6 h-6 rounded-full bg-[#e0e5ec] dark:bg-background neumorphic-elevated flex items-center justify-center transform transition-transform duration-300 shadow-sm ${
          dark ? 'translate-x-8' : ''
        }`}
      >
        <span className="material-symbols-outlined text-[14px] text-primary" data-icon={dark ? 'dark_mode' : 'light_mode'}>
          {dark ? 'dark_mode' : 'light_mode'}
        </span>
      </div>
    </button>
  )
}