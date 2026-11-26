const {
  integer,
  index,
  sqliteTable,
  text
} = require('drizzle-orm/sqlite-core');

const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
}, (table) => [
  index('todos_completed_created_id_idx').on(
    table.completed,
    table.createdAt,
    table.id
  )
]);

module.exports = { todos };
