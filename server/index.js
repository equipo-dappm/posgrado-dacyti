// ============================================================================
// BACKEND — API REST del Sistema de Posgrado DACYTI
// ============================================================================
// Express + SQLite (better-sqlite3). Expuesto en http://localhost:3000.
// El frontend (Vite, puerto 5173) consume estas rutas con /api/... .
// ============================================================================

import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import db from './database.js'

const app = express()
const PORT = 3000

// Middlewares globales: habilitan CORS y parsean cuerpos JSON.
app.use(cors())
app.use(express.json())

// === ENDPOINT DE PRUEBA ======================================================
// Devuelve un mensaje de conexión y la lista de tablas de la BD.

app.get('/api/test', (req, res) => {
  const tablas = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all()

  res.json({
    mensaje: 'Backend conectado correctamente',
    tablas,
  })
})
// === CATÁLOGO DE PROGRAMAS ===================================================
// Lista los programas con su total de alumnos inscritos (LEFT JOIN).
app.get('/api/programas', (req, res) => {
  try {
    const programas = db.prepare(`
      SELECT
        p.id,
        p.clave,
        p.nombre,
        COUNT(a.id) AS total_alumnos
      FROM programas p
      LEFT JOIN alumnos a
        ON a.programa_id = p.id
      GROUP BY p.id, p.clave, p.nombre
      ORDER BY p.id;
    `).all();

    res.json(programas);
  } catch (error) {
    console.error("Error al obtener programas:", error);
    res.status(500).json({
      error: "Error al obtener los programas"
    });
  }
});
// === ALUMNOS POR PROGRAMA ====================================================
// Lista todos los alumnos de un programa según su clave (ej. DCC).
// Calcula estado_general: 'Completo' si tiene 8 documentos 'Entregado'.
app.get('/api/programas/:clave/alumnos', (req, res) => {
  try {
    const { clave } = req.params

    const alumnos = db.prepare(`
      SELECT
        a.id,
        a.matricula,
        a.nombre,
        a.apellido_paterno,
        a.apellido_materno,
        s.numero AS semestre,

        CASE
          WHEN (
            SELECT COUNT(*)
            FROM alumno_documento ad
            INNER JOIN estados_documento ed
              ON ad.estado_id = ed.id
            WHERE ad.alumno_id = a.id
              AND ed.nombre = 'Entregado'
          ) = 8
          THEN 'Completo'
          ELSE 'Incompleto'
        END AS estado_general

      FROM alumnos a
      INNER JOIN programas p
        ON a.programa_id = p.id
      LEFT JOIN semestres s
        ON a.semestre_id = s.id
      WHERE p.clave = ?
      ORDER BY a.id;
`).all(clave.toUpperCase())
    res.json(alumnos)
  } catch (error) {
    console.error('Error al obtener alumnos:', error)

    res.status(500).json({
      error: 'Error al obtener los alumnos',
    })
  }
})
// === EXPEDIENTE DE UN ALUMNO ================================================
// Devuelve datos del alumno, su proyecto (tesis/anteproyecto) y sus documentos.
app.get('/api/alumnos/:id/expediente', (req, res) => {
  try {
    const { id } = req.params

    const alumno = db.prepare(`
      SELECT
        a.id,
        a.matricula,
        a.nombre,
        a.apellido_paterno,
        a.apellido_materno,
        s.numero AS semestre
      FROM alumnos a
      LEFT JOIN semestres s
        ON a.semestre_id = s.id
      WHERE a.id = ?
    `).get(id)

    if (!alumno) {
      return res.status(404).json({
        error: 'Alumno no encontrado',
      })
    }

    const proyecto = db.prepare(`
      SELECT
        p.id,
        p.nombre,
        tp.nombre AS tipo
      FROM proyectos p
      INNER JOIN tipos_proyecto tp
        ON p.tipo_id = tp.id
      WHERE p.alumno_id = ?
      LIMIT 1
    `).get(id)

    const documentos = db.prepare(`
      SELECT
        td.clave,
        td.nombre,
        ed.nombre AS estado
      FROM alumno_documento ad
      INNER JOIN tipos_documento td
        ON ad.tipo_documento_id = td.id
      INNER JOIN estados_documento ed
        ON ad.estado_id = ed.id
      WHERE ad.alumno_id = ?
      ORDER BY td.id
    `).all(id)

    res.json({
      alumno,
      proyecto: proyecto || null,
      documentos,
    })
  } catch (error) {
    console.error('Error al obtener expediente:', error)

    res.status(500).json({
      error: 'Error al obtener el expediente del alumno',
    })
  }
})
// === AUTENTICACIÓN ===========================================================
// Valida usuario y contraseña del administrador.
// El hash se guarda como "salt:hash" (scrypt); se comparan de forma segura.
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body

  if (!usuario || !password) {
    return res.status(400).json({
      mensaje: 'Usuario y contraseña son obligatorios',
    })
  }

  const administrador = db
    .prepare('SELECT id, usuario, password_hash FROM administrador WHERE usuario = ?')
    .get(usuario)

  if (!administrador) {
    return res.status(401).json({
      mensaje: 'Usuario o contraseña incorrectos',
    })
  }

  const [salt, hashGuardado] = administrador.password_hash.split(':')

  const hashCalculado = crypto
    .scryptSync(password, salt, 64)
    .toString('hex')

  const contraseñaCorrecta =
    hashCalculado.length === hashGuardado.length &&
    crypto.timingSafeEqual(
      Buffer.from(hashCalculado),
      Buffer.from(hashGuardado)
    )

  if (!contraseñaCorrecta) {
    return res.status(401).json({
      mensaje: 'Usuario o contraseña incorrectos',
    })
  }

  return res.json({
    mensaje: 'Inicio de sesión correcto',
    usuario: administrador.usuario,
  })
})
// === ACTUALIZAR ESTADO DE UN DOCUMENTO =======================================
// Cambia el estado de un documento (Entregado/Pendiente) de un alumno.
app.patch('/api/alumnos/:alumnoId/documentos/:clave', (req, res) => {
  try {
    const { alumnoId, clave } = req.params
    const { estado } = req.body

    if (!['Entregado', 'Pendiente'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado no válido',
      })
    }

    const tipoDocumento = db.prepare(`
      SELECT id
      FROM tipos_documento
      WHERE clave = ?
    `).get(clave.toUpperCase())

    if (!tipoDocumento) {
      return res.status(404).json({
        error: 'Documento no encontrado',
      })
    }

    const estadoDocumento = db.prepare(`
      SELECT id
      FROM estados_documento
      WHERE nombre = ?
    `).get(estado)

    if (!estadoDocumento) {
      return res.status(404).json({
        error: 'Estado no encontrado',
      })
    }

    const resultado = db.prepare(`
      UPDATE alumno_documento
      SET estado_id = ?
      WHERE alumno_id = ?
        AND tipo_documento_id = ?
    `).run(
      estadoDocumento.id,
      alumnoId,
      tipoDocumento.id
    )

    if (resultado.changes === 0) {
      return res.status(404).json({
        error: 'No se encontró el documento del alumno',
      })
    }

    res.json({
      mensaje: 'Estado actualizado correctamente',
      clave: clave.toUpperCase(),
      estado,
    })
  } catch (error) {
    console.error('Error al actualizar documento:', error)

    res.status(500).json({
      error: 'Error al actualizar el documento',
    })
  }
})

// === ESTADÍSTICAS DEL DASHBOARD =============================================
// Devuelve: total de alumnos inscritos, y los desglosados por nivel
// (doctorado / maestría), clasificando por el prefijo de la clave del
// programa (D.. = Doctorado, M.. = Maestría).
app.get('/api/estadisticas', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) AS n FROM alumnos').get().n

    const doctorado = db
      .prepare(`
        SELECT COUNT(*) AS n
        FROM alumnos a
        INNER JOIN programas p ON a.programa_id = p.id
        WHERE p.clave LIKE 'D%'
      `)
      .get().n

    const maestria = db
      .prepare(`
        SELECT COUNT(*) AS n
        FROM alumnos a
        INNER JOIN programas p ON a.programa_id = p.id
        WHERE p.clave LIKE 'M%'
      `)
      .get().n

    res.json({ total, doctorado, maestria })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ error: 'Error al obtener las estadísticas' })
  }
})

// Arranque del servidor.
app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`)
})
