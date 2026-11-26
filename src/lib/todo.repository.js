const { desc, eq } = require('drizzle-orm');
const { getDatabase } = require('../db/client');
const { todos } = require('../db/schema');

function createTodo(todo) {
  const database = getDatabase();
  const [createdTodo] = database
    .insert(todos)
    .values(todo)
    .returning()
    .all();

  return createdTodo;
}

function listTodos({ completed, limit, offset }) {
  const database = getDatabase();
  const query = database.select().from(todos);
  const filteredQuery = completed === undefined
    ? query
    : query.where(eq(todos.completed, completed));
  const records = filteredQuery
    .orderBy(desc(todos.createdAt), desc(todos.id))
    .limit(limit + 1)
    .offset(offset)
    .all();

  return {
    data: records.slice(0, limit),
    hasMore: records.length > limit
  };
}

function getTodoById(id) {
  const [todo] = getDatabase()
    .select()
    .from(todos)
    .where(eq(todos.id, id))
    .limit(1)
    .all();

  return todo ?? null;
}

function updateTodoById(id, updates) {
  const [todo] = getDatabase()
    .update(todos)
    .set(updates)
    .where(eq(todos.id, id))
    .returning()
    .all();

  return todo ?? null;
}

function deleteTodoById(id) {
  const result = getDatabase()
    .delete(todos)
    .where(eq(todos.id, id))
    .run();

  return result.changes > 0;
}

module.exports = {
  createTodo,
  deleteTodoById,
  getTodoById,
  listTodos,
  updateTodoById
};
