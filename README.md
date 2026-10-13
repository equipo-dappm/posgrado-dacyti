# Sistema de Gestión de Posgrado DACYTI

Aplicación web para el seguimiento expedientes documentales de los programas de
posgrado de la DACYTI: catálogo de programas, lista de alumnos por programa,
expediente de cada alumno (proyecto/tesis + 8 documentos) y estadísticas
generales.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + React Router 7, Vite 8, Tailwind CSS 4 |
| Backend | Express 5 (API REST en el puerto 3000) |
| Base de datos | SQLite vía `better-sqlite3` (archivo local `posgrados`) |
| Lint | Oxlint (`pnpm lint`) |

## Requisitos

- Node.js 20+ (probado con Node 26).
- **pnpm**. Usa pnpm para todo; no uses npm ni yarn.

## Puesta en marcha

```bash
# 1. Dependencias (solo la primera vez)
pnpm install

# 2. Backend (terminal 1) — API en http://localhost:3000
node server/index.js

# 3. Frontend (terminal 2) — app en http://localhost:5173
pnpm dev
```

Abre <http://localhost:5173>. Ambos procesos deben estar corriendo: el frontend
consume la API en `http://localhost:3000`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo de Vite con HMR |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Sirve el build de producción en `http://localhost:4173` |
| `pnpm lint` | Análisis estático con Oxlint |
| `node server/index.js` | Arranca la API REST |
| `node server/create-admin.js` | Script interactivo para dar de alta un administrador |

## Estructura del proyecto

```
index.html            Entrada de Vite
vite.config.js        Plugins de React y Tailwind
src/
  main.jsx            Monta React y carga los estilos
  App.jsx             Rutas: /login, /programas, /programas/:clave, /nuevo-alumno
  components/         AppLayout (menú lateral), LogoutButton
  pages/              LoginPage, SelectorPrograma, ListaAlumnos, NuevoAlumno
  index.css           Tokens UJAT (colores + tipografía) y componentes
server/
  index.js            API Express (rutas /api/...)
  database.js         Conexión SQLite (archivo ./posgrados, relativo al CWD)
  schema.sql          Esquema de la base de datos
  create-admin.js     Alta de administradores con hash scrypt
insertar-documentos.sql   Seed: estados de los 8 documentos por alumno
insertar-proyectos.js     Seed: anteproyectos/tesis por matrícula
posgrados             Base de datos SQLite local (ignorada por git)
```

> El backend resuelve la BD respecto al directorio de trabajo, así que
> `node server/index.js` debe ejecutarse desde la raíz del proyecto.

## Base de datos

1. Crear el esquema (si no existe la BD):

   ```bash
   sqlite3 posgrados < server/schema.sql
   ```

2. Cargar los seeds (opcionales, sólo para reconstruir datos de demostración):

   ```bash
   sqlite3 posgrados < insertar-documentos.sql
   node insertar-proyectos.js
   ```

3. Dar de alta un administrador para poder iniciar sesión:

   ```bash
   node server/create-admin.js
   ```

La autenticación compara `scrypt(password, salt)` contra el
`password_hash` guardado en la tabla `administrador`.

## API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/test` | Prueba de conexión y tablas de la BD |
| `GET` | `/api/estadisticas` | Total de alumnos, doctorado y maestría |
| `GET` | `/api/programas` | Programas con su total de alumnos |
| `GET` | `/api/programas/:clave/alumnos` | Alumnos de un programa y su estado general |
| `GET` | `/api/alumnos/:id/expediente` | Datos del alumno, su proyecto y sus documentos |
| `PATCH` | `/api/alumnos/:alumnoId/documentos/:clave` | Cambia un documento a `Entregado`/`Pendiente` |
| `POST` | `/api/login` | Autentica usuario y contraseña |

## Notas

- `pnpm build` genera `dist/` (ignorado por git); se regenera cuando haga falta.
- El botón de cerrar sesión aparece al pie de la barra lateral.
- El inicio del sistema es `/programas` (estadísticas, búsqueda global y
  tarjetas de programa).
- Identidad visual UJAT: tres verdes institucionales y tipografía Caecilia (con
  respaldo Roboto Slab) definidos en `src/index.css`.
