// ============================================================================
// PÁGINA: LISTA DE ALUMNOS POR PROGRAMA
// ============================================================================
// Muestra los alumnos de un programa (clave de la URL) como tarjetas
// expandibles. Cada tarjeta carga el expediente del alumno (GET
// /api/alumnos/:id/expediente) y permite cambiar el estado de cada
// documento (PATCH /api/alumnos/:id/documentos/:clave).
// ============================================================================

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

// --- Mapa de claves de programa a su nombre completo ------------------------
const NOMBRE_PROGRAMA = {
  DCC: 'Doctorado en Ciencias de la Computación',
  DGTI: 'Doctorado en Gestión de Tecnologías de Información',
  MCCR: 'Maestría en Ciencias de la Computación (Redes)',
  MATAC: 'Maestría en Administración de Tecnologías Avanzadas de Computación',
  MATI: 'Maestría en Administración de Tecnologías de Información',
}



// ============================================================================
// TARJETA DE ESTUDIANTE (expediente expandible)
// ============================================================================
function TarjetaEstudiante({ estudiante }) {
  const [expanded, setExpanded] = useState(false)
  const [expediente, setExpediente] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [completo, setCompleto] = useState(false)

  // Documentos requeridos para considerar el expediente "Completo".
  const DOCUMENTOS_REQUERIDOS = [
    'F1', 'F2', 'F3', 'F4', 'F5', 'EV1', 'EV2', 'EV7',
  ]

  // --- Carga el expediente del alumno desde el backend (una sola vez) ------
    const cargarExpediente = () => {
    if (expediente || cargando) {
      return
    }

    setCargando(true)
    setError('')

    fetch(`http://localhost:3000/api/alumnos/${estudiante.id}/expediente`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el expediente')
        }

        return response.json()
      })
      .then((data) => {
    setExpediente(data)

  // Determina si todos los documentos requeridos están "Entregado".
  const estaCompleto = DOCUMENTOS_REQUERIDOS.every((clave) => {
    const documento = data.documentos.find(
      (doc) => doc.clave === clave
    )

    return documento?.estado === 'Entregado'
  })

  setCompleto(estaCompleto)
})
      .catch(() => {
        setError('No se pudo cargar el expediente')
      })
      .finally(() => {
        setCargando(false)
      })
  }
  // --- Alterna Entregado/Pendiente de un documento (PATCH al backend) ------
  const cambiarEstadoDocumento = async (documento) => {
  const nuevoEstado =
    documento.estado === 'Entregado' ? 'Pendiente' : 'Entregado'

  try {
    const response = await fetch(
      `http://localhost:3000/api/alumnos/${estudiante.id}/documentos/${documento.clave}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('No se pudo actualizar el documento')
    }

    const documentosActualizados = expediente.documentos.map((doc) =>
      doc.clave === documento.clave
        ? { ...doc, estado: nuevoEstado }
        : doc
    )

    setExpediente({
      ...expediente,
      documentos: documentosActualizados,
    })

    // Recalcula si el expediente quedó completo tras el cambio.
    const estaCompleto = DOCUMENTOS_REQUERIDOS.every((clave) => {
      const doc = documentosActualizados.find(
        (documento) => documento.clave === clave
      )

      return doc?.estado === 'Entregado'
    })

    setCompleto(estaCompleto)
  } catch (error) {
    console.error(error)
  }
}
  // --- Alterna la expansión de la tarjeta; al expandir, carga expediente ----
  const alternarTarjeta = () => {
    const nuevoEstado = !expanded

    setExpanded(nuevoEstado)

    if (nuevoEstado) {
      cargarExpediente()
    }
  }
  // --- Estado general mostrado en la tarjeta --------------------------------
  // Con el expediente ya cargado se recalcula con `completo` (que se actualiza
  // en cada cambio de documento); si no, se conserva el valor del backend.
  const estadoVisible = expediente
    ? completo
      ? 'Completo'
      : 'Incompleto'
    : estudiante.estadoGeneral

  // --- Render: fila visible (resumen) + área expandible (expediente) --------
  return (
    <div className="card rounded-xl overflow-hidden border border-outline-variant/40">
      {/* Fila visible: matrícula, nombre, semestre, estado general */}
      <div
        className="p-card-padding flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:bg-surface-container-low transition-colors"
        onClick={alternarTarjeta}
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div>
            <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant mb-1">Matrícula</p>
            <p className="text-body-md font-body-md font-medium text-on-surface">{estudiante.matricula}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant mb-1">Nombre Completo</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ujat-verde-1-soft flex items-center justify-center text-ujat-verde-1 font-bold text-sm">
                {estudiante.iniciales}
              </div>
              <p className="text-body-md font-body-md font-medium text-on-surface">{estudiante.nombre}</p>
            </div>
          </div>
          <div>
            <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant mb-1">Semestre</p>
            <p className="text-body-md font-body-md font-medium text-on-surface">{estudiante.semestre}</p>
          </div>
        </div>
          <div>
            <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant mb-1">
              Estado
            </p>

            <span
              className={`px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold ${
                estadoVisible === 'Completo'
                  ? 'pill-green'
                  : 'pill-grey'
              }`}
            >
              {estadoVisible}
            </span>
          </div>
        <button
          className="w-10 h-10 rounded-full bg-ujat-verde-1 text-white flex items-center justify-center shrink-0 hover:bg-ujat-verde-2 transition-colors"
          type="button"
          aria-label="Expandir/contraer detalle"
        >
          <span
            className={`material-symbols-outlined transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          >
            expand_more
          </span>
        </button>
      </div>
      {/* Área expandible: muestra el expediente al hacer clic */}
      <div
        className={`expandable-content bg-surface-container-low/30 border-t border-outline-variant/10 ${
          expanded ? 'expanded' : ''
        }`}
      >
        <div className="min-h-0">
          <div className="p-card-padding">
            {cargando ? (
            <p className="text-body-md text-on-surface-variant italic text-center py-4">
              Cargando información...
            </p>
          ) : error ? (
            <p className="text-body-md text-on-surface-variant italic text-center py-4">
              {error}
            </p>
          ) : expediente ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Tesis & Formatos */}
              <div className="flex flex-col gap-6">
                <div className="bg-ujat-verde-1-soft p-4 rounded-lg border border-outline-variant/40">
                  <h4 className="text-label-md font-label-md text-ujat-verde-1 font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      menu_book
                    </span>
                    Tesis/Anteproyecto
                  </h4>

                  <p className="text-body-md font-body-md text-on-surface">
                    {expediente.proyecto
                      ? expediente.proyecto.nombre
                      : 'Sin anteproyecto registrado'}
                  </p>
                </div>

                <div>
                  <h4 className="text-label-md font-label-md text-on-surface-variant font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      description
                    </span>
                    Formatos
                  </h4>

                  <div className="flex flex-wrap gap-3">
                    {expediente.documentos
                      .filter((documento) =>
                        documento.clave.startsWith('F')
                      )
                      .map((documento) => (
                        <button
                          key={documento.clave}
                          type="button"
                          onClick={() => cambiarEstadoDocumento(documento)}
                          className={`px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold cursor-pointer transition-all ${
                            documento.estado === 'Entregado'
                              ? 'pill-green'
                              : 'pill-grey'
                          }`}
                        >
                          {documento.clave}: {documento.estado}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Evaluaciones */}
              <div>
                <h4 className="text-label-md font-label-md text-on-surface-variant font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    fact_check
                  </span>
                  Estancias
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {expediente.documentos
                    .filter((documento) =>
                      documento.clave.startsWith('EV')
                    )
                    .map((documento) => (
                      <div
                        key={documento.clave}
                        className="card p-3 rounded-lg flex flex-col items-center justify-center text-center"
                      >
                        <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant mb-1">
                          {documento.clave}
                        </span>

                        <button
                          type="button"
                          onClick={() => cambiarEstadoDocumento(documento)}
                          className={`px-2 py-0.5 rounded text-xs w-full cursor-pointer transition-all ${
                            documento.estado === 'Entregado'
                              ? 'pill-green'
                              : 'pill-grey'
                          }`}
                        >
                          {documento.estado}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PÁGINA PRINCIPAL: LISTA DE ALUMNOS DE UN PROGRAMA
// ============================================================================
export default function ListaAlumnos() {
  const { clave } = useParams()
  const claveNormalizada = (clave ?? '').toUpperCase()
  const nombrePrograma = NOMBRE_PROGRAMA[claveNormalizada] ?? claveNormalizada
    const [estudiantes, setEstudiantes] = useState([])
  const [, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // --- Carga los alumnos del programa desde el backend ----------------------
  useEffect(() => {
    fetch(`http://localhost:3000/api/programas/${claveNormalizada}/alumnos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los alumnos')
        }

        return response.json()
      })
      .then((data) => {
        // Adapta la respuesta del backend a los campos que usa la tarjeta.
        const estudiantesAdaptados = data.map((alumno) => ({
          id: alumno.id,
          matricula: alumno.matricula,
          nombre: `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`,
          iniciales: `${alumno.nombre[0]}${alumno.apellido_paterno[0]}`,
          semestre: `${alumno.semestre}° Semestre`,
          estadoGeneral: alumno.estado_general,
        }))

        setEstudiantes(estudiantesAdaptados)
      })
      .catch(() => {
        setError('No se pudieron cargar los alumnos')
      })
  }, [claveNormalizada])

  // --- Filtro local por matrícula o nombre dentro del programa -------------
  const termino = busqueda.trim().toLowerCase()
  const estudiantesFiltrados = termino
    ? estudiantes.filter(
        (estudiante) =>
          estudiante.matricula.toLowerCase().includes(termino) ||
          estudiante.nombre.toLowerCase().includes(termino),
      )
    : estudiantes

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto flex flex-col gap-element-gap">
        {/* Encabezado con la clave y nombre del programa */}
        <header className="mb-8">
          <h1 className="text-headline-md font-headline-md font-bold text-ujat-verde-1">
            {claveNormalizada} - {nombrePrograma}
          </h1>
          <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant">
            Vista de Alumnos por Programa
          </p>
        </header>
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Neumorphic Search Bar */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ujat-verde-1">
              search
            </span>
            <input
              className="input-ujat w-full h-12 pl-12 pr-4 rounded-xl text-body-md font-body-md"
              placeholder="Buscar por matrícula o nombre..."
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>
        </div>
        {/* Main List: Expandable Student Cards */}
        <div className="flex flex-col gap-element-gap">
          {estudiantesFiltrados.map((estudiante) => (
            <TarjetaEstudiante key={estudiante.matricula} estudiante={estudiante} />
          ))}
          {estudiantes.length > 0 && estudiantesFiltrados.length === 0 && (
            <p className="text-sm text-on-surface-variant italic text-center py-6">
              Sin resultados para «{busqueda.trim()}»
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}