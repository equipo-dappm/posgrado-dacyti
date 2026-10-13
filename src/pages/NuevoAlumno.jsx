// ============================================================================
// PÁGINA: NUEVO ALUMNO (VISTA PREVIA)
// ============================================================================
// Formulario de alta de alumno. Por el momento es SOLO UNA VISTA PREVIA: los
// campos se muestran con la identidad UJAT pero no están conectados al backend
// (el botón "Registrar alumno" no envía nada).
// ============================================================================

import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout.jsx'

// --- Opciones de los catálogos (estáticas, solo para la vista previa) ------
const PROGRAMAS = ['DCC', 'DGTI', 'MCC', 'MTAC', 'MATI']
const SEMESTRES = [1, 2, 3, 4, 5, 6, 7, 8]
const TIPOS_PROYECTO = ['Anteproyecto', 'Tesis']
const DOCUMENTOS_INICIALES = ['F1', 'F2', 'F3', 'F4', 'F5', 'EV1', 'EV2', 'EV7']

// --- Campo de formulario reutilizable --------------------------------------
function Campo({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-base">
      <label className="font-label-md text-label-md font-bold text-on-background" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}

// --- Encabezado de sección del formulario ----------------------------------
function SeccionFormulario({ titulo, children }) {
  return (
    <section className="flex flex-col">
      <h2 className="text-headline-md font-headline-md font-bold text-ujat-verde-1 mb-5 pb-2 border-b border-outline-variant/50">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

export default function NuevoAlumno() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-element-gap">
        {/* Encabezado */}
        <header className="mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-md font-headline-md font-bold text-ujat-verde-1">
              Nuevo alumno
            </h1>
            <span className="text-label-sm font-label-sm font-semibold px-3 py-1 rounded-full bg-ujat-verde-3-soft text-[#4a6b13]">
              Vista previa · sin funcionalidad
            </span>
          </div>
          <p className="text-label-sm font-label-sm font-semibold text-on-surface-variant mt-1">
            Registro de un alumno de posgrado y su expediente inicial
          </p>
        </header>

        {/* Formulario (previsualización) */}
        <form
          className="card rounded-xl overflow-hidden"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="ujat-stripe" />

          <div className="p-card-padding flex flex-col gap-10">
            {/* Datos personales */}
            <SeccionFormulario titulo="Datos personales">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Campo label="Matrícula" htmlFor="matricula">
                  <input
                    className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                    id="matricula"
                    placeholder="Ej. 262H23001"
                    type="text"
                  />
                </Campo>

                <Campo label="Nombre(s)" htmlFor="nombre">
                  <input
                    className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                    id="nombre"
                    placeholder="Nombre del alumno"
                    type="text"
                  />
                </Campo>

                <Campo label="Apellido paterno" htmlFor="apellido-paterno">
                  <input
                    className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                    id="apellido-paterno"
                    placeholder="Apellido paterno"
                    type="text"
                  />
                </Campo>

                <Campo label="Apellido materno" htmlFor="apellido-materno">
                  <input
                    className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                    id="apellido-materno"
                    placeholder="Apellido materno"
                    type="text"
                  />
                </Campo>
              </div>
            </SeccionFormulario>

            {/* Información académica */}
            <SeccionFormulario titulo="Información académica">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Campo label="Programa" htmlFor="programa">
                  <select className="input-ujat w-full h-12 px-4 rounded-xl font-body-md" id="programa" defaultValue="">
                    <option value="">Selecciona un programa</option>
                    {PROGRAMAS.map((clave) => (
                      <option key={clave} value={clave}>
                        {clave}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Semestre" htmlFor="semestre">
                  <select className="input-ujat w-full h-12 px-4 rounded-xl font-body-md" id="semestre" defaultValue="">
                    <option value="">Selecciona un semestre</option>
                    {SEMESTRES.map((numero) => (
                      <option key={numero} value={numero}>
                        {numero}° Semestre
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>
            </SeccionFormulario>

            {/* Proyecto */}
            <SeccionFormulario titulo="Proyecto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Campo label="Tipo" htmlFor="tipo-proyecto">
                  <select className="input-ujat w-full h-12 px-4 rounded-xl font-body-md" id="tipo-proyecto" defaultValue="">
                    <option value="">Selecciona un tipo</option>
                    {TIPOS_PROYECTO.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </Campo>

                <div className="md:col-span-2">
                  <Campo label="Nombre del anteproyecto / tesis" htmlFor="nombre-proyecto">
                    <input
                      className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                      id="nombre-proyecto"
                      placeholder="Título del proyecto"
                      type="text"
                    />
                  </Campo>
                </div>
              </div>
            </SeccionFormulario>

            {/* Expediente inicial */}
            <SeccionFormulario titulo="Expediente inicial">
              <p className="text-sm text-on-surface-variant mb-4">
                Al registrar al alumno, estos documentos se crean con estado{' '}
                <span className="font-semibold text-on-background">Pendiente</span> y podrán
                actualizarse después desde su expediente.
              </p>

              <div className="flex flex-wrap gap-3">
                {DOCUMENTOS_INICIALES.map((clave) => (
                  <span
                    key={clave}
                    className="px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold pill-grey"
                  >
                    {clave}: Pendiente
                  </span>
                ))}
              </div>
            </SeccionFormulario>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2 border-t border-outline-variant/50">
              <button
                className="btn-ghost h-12 px-6 rounded-xl text-label-md font-label-md font-bold"
                type="button"
                onClick={() => navigate('/programas')}
              >
                Cancelar
              </button>
              <button
                className="btn-primary h-12 px-6 rounded-xl text-label-md font-label-md font-bold"
                type="submit"
              >
                Registrar alumno
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
