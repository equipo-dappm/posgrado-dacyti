// ============================================================================
// SCRIPT DE UTILIDAD — CREAR ADMINISTRADOR
// ============================================================================
// Script interactivo de consola: pide usuario y contraseña y los inserta
// en la tabla "administrador" con la contraseña cifrada (scrypt).
// Uso: node server/create-admin.js
// ============================================================================

import crypto from 'node:crypto'
import readline from 'node:readline'
import db from './database.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Pide un texto al usuario y espera la respuesta (promesa).
function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve)
  })
}

// Genera el hash de la contraseña: "salt:hash" (scrypt de 64 bytes hex).
function generarHash(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')

  return `${salt}:${hash}`
}

// --- Flujo principal de creación de administrador ---------------------------
async function crearAdministrador() {
  console.log('\n=== CREAR ADMINISTRADOR ===\n')

  const usuario = (await pregunta('Usuario: ')).trim()
  const password = await pregunta('Contraseña: ')

  if (!usuario || !password) {
    console.log('\n❌ El usuario y la contraseña son obligatorios.')
    rl.close()
    db.close()
    return
  }

  // Evita duplicados: el usuario ya existe.
  const existente = db
    .prepare('SELECT id FROM administrador WHERE usuario = ?')
    .get(usuario)

  if (existente) {
    console.log('\n❌ Ese usuario ya existe.')
    rl.close()
    db.close()
    return
  }

  const passwordHash = generarHash(password)

  db.prepare(
    'INSERT INTO administrador (usuario, password_hash) VALUES (?, ?)'
  ).run(usuario, passwordHash)

  console.log('\n✅ Administrador creado correctamente.')
  console.log(`Usuario: ${usuario}`)

  rl.close()
  db.close()
}

crearAdministrador()

