const { integer, sqliteTable, text } = require('drizzle-orm/sqlite-core');

const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

module.exports = { todos };
