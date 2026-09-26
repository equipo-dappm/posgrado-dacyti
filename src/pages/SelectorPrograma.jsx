// ============================================================================
// PÁGINA: SELECCIÓN DE PROGRAMA
// ============================================================================
// Muestra los programas de posgrado en tarjetas. Al hacer clic en una
// tarjeta navega a "ListaAlumnos" del programa. Los datos se cargan desde
// GET /api/programas.
// ============================================================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

// --- Tarjeta individual de un programa -------------------------------------
// El clic navega a /programas/:clave.
function ProgramaCard({ programa }) {
  const navigate = useNavigate()

  return (
    <button
      className={`neumorphic-elevated neumorphic-elevated-hover rounded-xl p-card-padding flex flex-col items-center text-center gap-4 group w-full ${
        programa.centered ? 'max-w-[360px]' : ''
      }`}
      type="button"
      onClick={() => navigate(`/programas/${programa.clave}`)}
    >
      <div className="w-20 h-20 rounded-full neumorphic-elevated flex items-center justify-center text-primary group-hover:text-primary-container transition-colors">
        <span className="text-headline-md font-bold">{programa.clave}</span>
      </div>
      <div>
        <h2 className="text-headline-md font-headline-md font-semibold text-on-background mb-2">
          {programa.nombre}
        </h2>
        <span className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 text-label-sm font-label-sm font-semibold text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
          {programa.alumnosInscritos} Alumnos Inscritos
        </span>
      </div>
    </button>
  )
}

export default function SelectorPrograma() {
  const [programas, setProgramas] = useState([])
  const [error, setError] = useState('')

  // --- Carga de programas desde el backend al montar la página -------------
  useEffect(() => {
    fetch('http://localhost:3000/api/programas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los programas')
        }

        return response.json()
      })
      .then((data) => {
        const programasAdaptados = data.map((programa) => ({
          clave: programa.clave,
          nombre: programa.nombre,
          alumnosInscritos: programa.total_alumnos,
          centered: programa.clave === 'MTAC' || programa.clave === 'MATI',
        }))

        setProgramas(programasAdaptados)
      })
      .catch(() => {
        setError('No se pudieron cargar los programas')
      })
  }, [])

  // Se separan las tarjetas: la mayoría en grid, las "centradas" en una fila.
  const gridCards = programas.filter((programa) => !programa.centered)
  const centeredCards = programas.filter((programa) => programa.centered)
  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto min-h-full flex flex-col gap-12">
        {/* Encabezado de la página */}
        <header className="text-center mb-8">
          <h1 className="text-display-lg font-display-lg font-bold text-on-background mb-4">
            DACYTI
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Elige el programa de postgrado para acceder a los expedientes y reportes correspondientes.
          </p>
        </header>
        {/* Bento Grid for Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridCards.map((programa) => (
            <ProgramaCard key={programa.clave} programa={programa} />
          ))}
        </div>
        {/* Centered Maestría row */}
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          {centeredCards.map((programa) => (
            <ProgramaCard key={programa.clave} programa={programa} />
          ))}
        </div>
        {/* Footer */}
        <footer className="w-full py-8 mt-auto flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10">
          <span className="text-label-sm font-bold text-on-surface">
            © 2024 University Administration System. Version 2.4.0-stable
          </span>
          <div className="flex gap-element-gap mt-4 md:mt-0">
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim text-label-sm font-label-sm font-semibold"
              href="#"
            >
              Privacidad
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim text-label-sm font-label-sm font-semibold"
              href="#"
            >
              Soporte
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim text-label-sm font-label-sm font-semibold"
              href="#"
            >
              Manual de Usuario
            </a>
          </div>
        </footer>
      </div>
    </AppLayout>
  )
}