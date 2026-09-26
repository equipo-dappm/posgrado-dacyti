-- ============================================================================
-- ESQUEMA DE BASE DE DATOS — Sistema de Posgrado DACYTI
-- ============================================================================
-- Aplicar para crear la estructura:  sqlite3 posgrados < server/schema.sql
-- ============================================================================

PRAGMA foreign_keys = ON;

-- === CATÁLOGOS (programas y semestres) =======================================
CREATE TABLE IF NOT EXISTS programas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS semestres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL UNIQUE
);

-- === ALUMNOS ================================================================
-- Cada alumno pertenece a un programa y cursa un semestre.
CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    apellido_paterno TEXT NOT NULL,
    apellido_materno TEXT,
    programa_id INTEGER NOT NULL,
    semestre_id INTEGER,
    FOREIGN KEY (programa_id) REFERENCES programas(id),
    FOREIGN KEY (semestre_id) REFERENCES semestres(id)
);

-- === PROYECTOS (tesis / anteproyectos) ======================================
CREATE TABLE IF NOT EXISTS tipos_proyecto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    tipo_id INTEGER NOT NULL,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_id) REFERENCES tipos_proyecto(id)
);

-- === DOCUMENTOS (formatos y evaluaciones del expediente) ====================
CREATE TABLE IF NOT EXISTS tipos_documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS estados_documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

-- Relación alumno-documento: un estado por documento y alumno.
CREATE TABLE IF NOT EXISTS alumno_documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER NOT NULL,
    tipo_documento_id INTEGER NOT NULL,
    estado_id INTEGER NOT NULL,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documento(id),
    FOREIGN KEY (estado_id) REFERENCES estados_documento(id),
    UNIQUE (alumno_id, tipo_documento_id)
);
