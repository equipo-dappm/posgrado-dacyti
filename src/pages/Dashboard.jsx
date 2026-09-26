// ============================================================================
// PÁGINA: PANEL PRINCIPAL (DASHBOARD)
// ============================================================================
// Vista "Inicio". Las tarjetas de estadísticas (Total inscritos, Doctorado
// y Maestría) se cargan desde GET /api/estadisticas.
// La tabla de "Alumnos recientes" aún usa datos de ejemplo (mock).
// ============================================================================

import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'

// --- Datos de ejemplo de la tabla de alumnos recientes (mock) --------------
const ALUMNOS = [
  {
    matricula: '262H23001',
    nombre: 'Jorge Fred Alvarez Salaya',
    programa: 'DCC',
    doctorado: true,
    estado: 'Pendiente',
  },
  {
    matricula: '252H21002',
    nombre: 'Petrona Denise Vertiz Hidalgo',
    programa: 'MCCR',
    doctorado: false,
    estado: 'Entregado',
  },
  {
    matricula: '241H18002',
    nombre: 'Marcela de los Angeles Yanes Perez',
    programa: 'DCC',
    doctorado: true,
    estado: 'Entregado',
  },
  {
    matricula: '262H19005',
    nombre: 'Ana Gissel Sanchez Almeida',
    programa: 'MATI',
    doctorado: false,
    estado: 'Pendiente',
  },
]

export default function Dashboard() {
  // --- Estado de las estadísticas (total / doctorado / maestría) -----------
  const [stats, setStats] = useState({
    total: 0,
    doctorado: 0,
    maestria: 0,
  })

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

  return (
    <AppLayout>
      {/* Barra de acciones: búsqueda (sin funcionalidad) y alta de alumno */}
      <div className="flex items-center gap-4 mb-7">
        <div className="flex-1 max-w-[360px]">
          <input
            className="w-full neumorphic-sunken bg-[#e0e5ec] text-on-background placeholder:text-outline-variant/50 px-[18px] py-3 rounded-xl font-body-md text-sm border-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
            placeholder="Buscar alumno o matricula..."
            type="text"
          />
        </div>
        <button
          className="neumorphic-elevated btn-active primary-glow bg-primary-container text-on-primary px-[22px] py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          type="button"
        >
          + Nuevo alumno
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
        {[
          { label: 'Total inscritos', value: stats.total },
          { label: 'Doctorado', value: stats.doctorado },
          { label: 'Maestria', value: stats.maestria },
        ].map((stat) => (
          <div key={stat.label} className="neumorphic-elevated rounded-xl px-[22px] py-5">
            <p className="text-[13px] text-on-surface-variant mb-[6px]">{stat.label}</p>
            <p className="text-[28px] font-semibold text-on-background">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table area */}
      <div className="neumorphic-elevated rounded-xl p-6">
        <p className="text-[15px] font-semibold text-on-background mb-[18px]">Alumnos recientes</p>

        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_2.2fr_1fr_1fr] gap-3 items-center px-4 py-[14px] rounded-xl mb-2 text-label-sm font-label-sm uppercase tracking-wide text-on-surface-variant">
          <span>Matricula</span>
          <span>Nombre</span>
          <span>Programa</span>
          <span>Seguimiento</span>
        </div>

        {ALUMNOS.map((alumno) => (
          <div
            key={alumno.matricula}
            className="grid grid-cols-2 md:grid-cols-[1.4fr_2.2fr_1fr_1fr] gap-3 items-center px-4 py-[14px] rounded-xl mb-2 neumorphic-elevated"
          >
            <span className="text-[13px] text-on-surface-variant">{alumno.matricula}</span>
            <span className="text-sm font-semibold text-on-background">{alumno.nombre}</span>
            <span
              className={`text-label-sm font-label-sm font-semibold px-3 py-1 rounded-full w-fit ${
                alumno.doctorado ? 'pill-doc' : 'pill-mae'
              }`}
            >
              {alumno.programa}
            </span>
            <span
              className={`text-label-sm font-label-sm font-semibold px-3 py-1 rounded-full w-fit ${
                alumno.estado === 'Entregado' ? 'pill-green' : 'pill-amber'
              }`}
            >
              {alumno.estado}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}