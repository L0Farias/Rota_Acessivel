import * as SQLite from "expo-sqlite";
import { Barreira, NovaBarreira, StatusBarreira, Usuario, NovoUsuario } from "@/types";

// Banco local: cada denúncia de barreira de acessibilidade fica salva no
// próprio dispositivo, funcionando mesmo sem internet (o usuário pode
// registrar a barreira na rua e o app não depende de conexão para isso).
const db = SQLite.openDatabaseSync("rota-acessivel.db");

export function inicializarBanco(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senhaHash TEXT NOT NULL,
      biometriaHabilitada INTEGER NOT NULL DEFAULT 0,
      criadoEm TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS barreiras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      descricao TEXT,
      severidade TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendente',
      latitude REAL,
      longitude REAL,
      fotoUri TEXT,
      criadoEm TEXT NOT NULL
    );
  `);
}

// ---------------------------------------------------------------------------
// Funções de usuários
// ---------------------------------------------------------------------------

/**
 * Cria um novo usuário no banco.
 * Retorna o id gerado ou lança exceção se o e-mail já existir.
 */
export function criarUsuario(usuario: NovoUsuario): number {
  const resultado = db.runSync(
    `INSERT INTO usuarios (nome, email, senhaHash, biometriaHabilitada, criadoEm)
     VALUES (?, ?, ?, ?, ?);`,
    [
      usuario.nome,
      usuario.email.toLowerCase().trim(),
      usuario.senhaHash,
      usuario.biometriaHabilitada ? 1 : 0,
      new Date().toISOString(),
    ]
  );
  return resultado.lastInsertRowId;
}

/**
 * Busca um usuário pelo e-mail (case-insensitive).
 * Retorna null se não encontrar.
 */
export function buscarUsuarioPorEmail(email: string): Usuario | null {
  return (
    db.getFirstSync<Usuario>(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1;",
      [email.toLowerCase().trim()]
    ) ?? null
  );
}

/**
 * Busca um usuário pelo id.
 */
export function buscarUsuarioPorId(id: number): Usuario | null {
  return (
    db.getFirstSync<Usuario>(
      "SELECT * FROM usuarios WHERE id = ? LIMIT 1;",
      [id]
    ) ?? null
  );
}

/**
 * Atualiza o campo biometriaHabilitada de um usuário.
 */
export function atualizarBiometriaUsuario(
  id: number,
  habilitada: boolean
): void {
  db.runSync(
    "UPDATE usuarios SET biometriaHabilitada = ? WHERE id = ?;",
    [habilitada ? 1 : 0, id]
  );
}

/**
 * Retorna o primeiro usuário com biometria habilitada (para login biométrico).
 * Em um app multi-usuário seria necessário escolher; aqui assumimos um único
 * usuário ativo por dispositivo — padrão comum em apps mobile.
 */
export function buscarUsuarioComBiometria(): Usuario | null {
  return (
    db.getFirstSync<Usuario>(
      "SELECT * FROM usuarios WHERE biometriaHabilitada = 1 LIMIT 1;"
    ) ?? null
  );
}

export function listarBarreiras(): Barreira[] {
  return db.getAllSync<Barreira>(
    "SELECT * FROM barreiras ORDER BY id DESC;"
  );
}

export function inserirBarreira(barreira: NovaBarreira): void {
  db.runSync(
    `INSERT INTO barreiras
      (categoria, descricao, severidade, status, latitude, longitude, fotoUri, criadoEm)
     VALUES (?, ?, ?, 'pendente', ?, ?, ?, ?);`,
    [
      barreira.categoria,
      barreira.descricao ?? "",
      barreira.severidade,
      barreira.latitude ?? null,
      barreira.longitude ?? null,
      barreira.fotoUri ?? null,
      new Date().toISOString(),
    ]
  );
}

export function atualizarStatusBarreira(
  id: number,
  status: StatusBarreira
): void {
  db.runSync("UPDATE barreiras SET status = ? WHERE id = ?;", [status, id]);
}

export function removerBarreira(id: number): void {
  db.runSync("DELETE FROM barreiras WHERE id = ?;", [id]);
}

export default db;
