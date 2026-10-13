// ============================================================================
// PÁGINA DE LOGIN
// ============================================================================
// Formulario de autenticación. Al enviarlo, consume POST /api/login del
// backend y, si las credenciales son correctas, redirige a /programas.
// ============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  // --- Estado local del formulario -----------------------------------------
  const [showPassword, setShowPassword] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // --- Envío del formulario: llama a la API de login -----------------------
  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario,
          password,
        }),
      })

      const data = await response.json()

      // Credenciales inválidas: mostramos el mensaje del servidor.
      if (!response.ok) {
        setError(data.mensaje || 'Usuario o contraseña incorrectos')
        return
      }

      // Login correcto: navega a la página de inicio (programas).
      navigate('/programas')
    } catch (error) {
      console.error(error)
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // --- Pantalla de login (interfaz) ----------------------------------------
  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center font-body-md text-on-background">
      {/* Login Card */}
      <div className="card w-full max-w-md mx-container-margin rounded-2xl overflow-hidden flex flex-col gap-element-gap">
        {/* Franja de los tres verdes institucionales */}
        <div className="ujat-stripe" />

        <div className="p-card-padding flex flex-col gap-element-gap">
          {/* Logo Area */}
          <div className="flex flex-col items-center justify-center py-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-ujat-verde-1 flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-headline-lg text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                school
              </span>
            </div>

            <h1 className="font-headline-md text-headline-md font-bold text-ujat-verde-1">
              GradAdmin
            </h1>

            <p className="font-label-md text-label-md font-medium text-on-surface-variant mt-1">
              Acceso a Posgrado · UJAT
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-element-gap" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-base">
              <label
                className="font-label-md text-label-md font-bold text-on-background pl-2"
                htmlFor="username"
              >
                Usuario
              </label>

              <input
                className="input-ujat w-full h-12 px-4 rounded-xl font-body-md"
                id="username"
                placeholder="Ingrese su usuario"
                required
                type="text"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-base">
              <label
                className="font-label-md text-label-md font-bold text-on-background pl-2"
                htmlFor="password"
              >
                Contraseña
              </label>

              <div className="relative">
                <input
                  className="input-ujat w-full h-12 px-4 pr-12 rounded-xl font-body-md"
                  id="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-ujat-verde-1 transition-colors"
                  type="button"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="sr-only peer" type="checkbox" />

                <div className="w-5 h-5 rounded border border-outline-variant bg-white peer-checked:bg-ujat-verde-1 peer-checked:border-ujat-verde-1 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>

                <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                  Recordarme
                </span>
              </label>

              <a
                className="font-label-sm text-label-sm font-semibold text-ujat-verde-1 hover:underline"
                href="#"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div className="text-center text-sm font-medium text-error">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              className="btn-primary mt-4 w-full h-12 rounded-xl font-label-md text-label-md font-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
