// ============================================================================
// PÁGINA: SELECCIÓN DE PROGRAMA (INICIO)
// ============================================================================
// Página principal. Muestra las estadísticas generales (GET /api/estadisticas),
// una búsqueda global de alumnos (GET /api/alumnos/buscar) y los programas de
// posgrado en tarjetas (GET /api/programas). Al hacer clic en una tarjeta
// navega a "ListaAlumnos" del programa.
// ============================================================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

// Estilo del badge de seguimiento según el estado del alumno.
function claseEstado(estado) {
  if (estado === 'Entregado' || estado === 'Completo') return 'pill-green'
  if (estado === 'Incompleto') return 'pill-grey'
  return 'pill-amber'
}

// --- Tarjeta individual de un programa -------------------------------------
// El clic navega a /programas/:clave.
function ProgramaCard({ programa }) {
  const navigate = useNavigate()

  return (
    <button
      className={`card rounded-xl p-card-padding flex flex-col items-center text-center gap-4 group w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        programa.centered ? 'max-w-[360px]' : ''
      }`}
      type="button"
      onClick={() => navigate(`/programas/${programa.clave}`)}
    >
      <div className="w-20 h-20 rounded-full bg-ujat-verde-1 text-white flex items-center justify-center group-hover:bg-ujat-verde-2 transition-colors">
        <span className="text-headline-md font-bold">{programa.clave}</span>
      </div>
      <div>
        <h2 className="text-headline-md font-headline-md font-semibold text-on-background mb-2">
          {programa.nombre}
        </h2>
        <span className="inline-flex items-center rounded-full bg-ujat-verde-1-soft px-3 py-1 text-label-sm font-label-sm font-semibold text-ujat-verde-1">
          <span className="w-2 h-2 rounded-full bg-ujat-verde-2 mr-2"></span>
          {programa.alumnosInscritos} Alumnos Inscritos
        </span>
      </div>
    </button>
  )
}

export default function SelectorPrograma() {
  const navigate = useNavigate()

  const [programas, setProgramas] = useState([])
  const [errorProgramas, setErrorProgramas] = useState('')

  // --- Estado de las estadísticas (total / doctorado / maestría) -----------
  const [stats, setStats] = useState({ total: 0, doctorado: 0, maestria: 0 })

  // --- Estado de la búsqueda global ----------------------------------------
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState('')

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
        setErrorProgramas('No se pudieron cargar los programas')
      })
  }, [])

  // --- Carga las estadísticas desde el backend al montar la página ---------
  useEffect(() => {
    fetch('http://localhost:3000/api/estadisticas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las estadísticas')
        }

        return response.json()
      })
      .then((data) => {
        setStats({
          total: data.total,
          doctorado: data.doctorado,
          maestria: data.maestria,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  // --- Búsqueda global con retardo (debounce) ------------------------------
  useEffect(() => {
    const termino = busqueda.trim()

    if (termino.length < 2) {
      return
    }

    const controlador = new AbortController()

    const temporizador = setTimeout(() => {
      setBuscando(true)

      fetch(`http://localhost:3000/api/alumnos/buscar?q=${encodeURIComponent(termino)}`, {
        signal: controlador.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al buscar alumnos')
          }

          return response.json()
        })
        .then((data) => {
          setResultados(data)
          setErrorBusqueda('')
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return
          }

          console.error(error)
          setResultados([])
          setErrorBusqueda('No se pudo realizar la búsqueda')
        })
        .finally(() => {
          setBuscando(false)
        })
    }, 300)

    return () => {
      clearTimeout(temporizador)
      controlador.abort()
    }
  }, [busqueda])

  const enBusqueda = busqueda.trim().length >= 2

  // Se separan las tarjetas: la mayoría en grid, las "centradas" en una fila.
  const gridCards = programas.filter((programa) => !programa.centered)
  const centeredCards = programas.filter((programa) => programa.centered)

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto min-h-full flex flex-col gap-10">
        {/* Encabezado de la página */}
        <header className="text-center mb-2">
          <h1 className="text-display-lg font-display-lg font-bold text-ujat-verde-1 mb-4">
            DACYTI
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Elige el programa de postgrado o busca un alumno por matrícula o nombre.
          </p>
        </header>

        {/* Búsqueda global */}
        <div className="relative max-w-[420px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ujat-verde-1 text-[20px]">
            search
          </span>
          <input
            className="input-ujat w-full pl-11 pr-[18px] py-3 rounded-xl font-body-md text-sm"
            placeholder="Buscar por matrícula o nombre..."
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total inscritos', value: stats.total },
            { label: 'Doctorado', value: stats.doctorado },
            { label: 'Maestria', value: stats.maestria },
          ].map((stat) => (
            <div key={stat.label} className="card rounded-xl px-[22px] py-5">
              <p className="text-[13px] text-on-surface-variant mb-[6px]">{stat.label}</p>
              <p className="text-[28px] font-semibold text-ujat-verde-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {enBusqueda ? (
          /* Resultados de la búsqueda global */
          <div className="card rounded-xl p-6">
            <div className="flex items-center justify-between mb-[18px]">
              <p className="text-[15px] font-semibold text-on-background">Resultados de búsqueda</p>
              {!buscando && !errorBusqueda && (
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  {resultados.length} {resultados.length === 1 ? 'coincidencia' : 'coincidencias'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-[1.4fr_2.2fr_1fr_1fr] gap-3 items-center px-4 py-[14px] rounded-xl mb-2 text-label-sm font-label-sm uppercase tracking-wide bg-ujat-verde-1-soft text-ujat-verde-1">
              <span>Matricula</span>
              <span>Nombre</span>
              <span>Programa</span>
              <span>Seguimiento</span>
            </div>

            {buscando && (
              <p className="text-sm text-on-surface-variant italic text-center py-6">
                Buscando...
              </p>
            )}

            {!buscando && errorBusqueda && (
              <p className="text-sm text-on-surface-variant italic text-center py-6">
                {errorBusqueda}
              </p>
            )}

            {!buscando && !errorBusqueda && resultados.length === 0 && (
              <p className="text-sm text-on-surface-variant italic text-center py-6">
                Sin resultados para «{busqueda.trim()}»
              </p>
            )}

            {!buscando &&
              !errorBusqueda &&
              resultados.map((alumno) => {
                const esDoctorado = alumno.programa?.startsWith('D')

                return (
                  <div
                    key={alumno.matricula}
                    className="grid grid-cols-2 md:grid-cols-[1.4fr_2.2fr_1fr_1fr] gap-3 items-center px-4 py-[14px] rounded-xl mb-2 border border-outline-variant/40 cursor-pointer hover:bg-surface-container-low transition-colors"
                    onClick={() => navigate(`/programas/${alumno.programa}`)}
                  >
                    <span className="text-[13px] text-on-surface-variant">{alumno.matricula}</span>
                    <span className="text-sm font-semibold text-on-background">{alumno.nombre}</span>
                    <span
                      className={`text-label-sm font-label-sm font-semibold px-3 py-1 rounded-full w-fit ${
                        esDoctorado ? 'pill-doc' : 'pill-mae'
                      }`}
                    >
                      {alumno.programa}
                    </span>
                    <span
                      className={`text-label-sm font-label-sm font-semibold px-3 py-1 rounded-full w-fit ${claseEstado(
                        alumno.estado,
                      )}`}
                    >
                      {alumno.estado}
                    </span>
                  </div>
                )
              })}
          </div>
        ) : (
          /* Programa grid */
          <div className="flex flex-col gap-10">
            {errorProgramas && (
              <p className="text-sm text-on-surface-variant italic text-center">
                {errorProgramas}
              </p>
            )}

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
          </div>
        )}

        {/* Footer */}
        <footer className="w-full mt-auto rounded-xl overflow-hidden bg-ujat-verde-1 text-white">
          <div className="ujat-stripe" />
          <div className="px-6 py-6 flex flex-col md:flex-row justify-between items-center">
            <span className="text-label-sm font-bold text-white">
              © 2024 University Administration System. Version 2.4.0-stable
            </span>
            <div className="flex gap-element-gap mt-4 md:mt-0">
              <a
                className="text-white/85 hover:text-white text-label-sm font-label-sm font-semibold"
                href="#"
              >
                Privacidad
              </a>
              <a
                className="text-white/85 hover:text-white text-label-sm font-label-sm font-semibold"
                href="#"
              >
                Soporte
              </a>
              <a
                className="text-white/85 hover:text-white text-label-sm font-label-sm font-semibold"
                href="#"
              >
                Manual de Usuario
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  )
}
