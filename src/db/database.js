const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { todos } = require('./todos.schema');

const CURRENT_SCHEMA_VERSION = 1;
const DEFAULT_DATABASE_PATH = path.join(process.cwd(), 'data', 'todos.sqlite');

function ensureSchema(client) {
  const versionRow = client.prepare('PRAGMA user_version').get();
  const currentVersion = versionRow.user_version;

  if (currentVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error('Database schema version is newer than this application supports.');
  }

  if (currentVersion < 1) {
    client.exec(`
      BEGIN IMMEDIATE;
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK (
          length(trim(title)) BETWEEN 1 AND 200
        ),
        completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      PRAGMA user_version = 1;
      COMMIT;
    `);
  }
}

function createDatabase(databasePath = DEFAULT_DATABASE_PATH) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const client = new Database(databasePath);
  client.pragma('foreign_keys = ON');
  client.pragma('busy_timeout = 5000');

  if (databasePath !== ':memory:') {
    client.pragma('journal_mode = WAL');
  }

  ensureSchema(client);
  const db = drizzle({ client, schema: { todos } });

  return { db, client };
}

function getDatabase() {
  if (!globalThis.__revolteTodoDatabase) {
    globalThis.__revolteTodoDatabase = createDatabase();
  }

  return globalThis.__revolteTodoDatabase;
}

module.exports = { createDatabase, getDatabase };
