const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { todos } = require('./schema');

const CURRENT_SCHEMA_VERSION = 1;
let client;
let database;

function ensureSchema(sqliteClient) {
  const [versionResult] = sqliteClient.pragma('user_version');
  const currentVersion = versionResult?.user_version ?? 0;

  if (currentVersion >= CURRENT_SCHEMA_VERSION) {
    return;
  }

  sqliteClient.transaction(() => {
    sqliteClient.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
          CHECK (completed IN (0, 1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS todos_completed_created_id_idx
        ON todos (completed, created_at, id);
    `);
    sqliteClient.pragma(`user_version = ${CURRENT_SCHEMA_VERSION}`);
  })();
}

function getDatabase() {
  if (database) {
    return database;
  }

  const configuredPath = process.env.DATABASE_PATH
    || path.join(process.cwd(), 'data', 'todos.sqlite');
  const databasePath = configuredPath === ':memory:'
    ? configuredPath
    : path.resolve(configuredPath);

  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  client = new Database(databasePath);
  client.pragma('foreign_keys = ON');
  client.pragma('busy_timeout = 5000');
  ensureSchema(client);
  database = drizzle(client, { schema: { todos } });

  return database;
}

function closeDatabase() {
  if (client) {
    client.close();
    client = undefined;
    database = undefined;
  }
}

module.exports = { closeDatabase, getDatabase };
