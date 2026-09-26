// ============================================================================
// CONEXIÓN A BASE DE DATOS
// ============================================================================
// Abre la base de datos SQLite local "posgrados" (se crea si no existe).
// Mejor-sqlite3 es síncrono y el archivo se resuelve relativo al CWD,
// por lo que el servidor debe ejecutarse desde la raíz del proyecto.
// ============================================================================

import Database from "better-sqlite3";

const db = new Database("./posgrados");

export default db;

