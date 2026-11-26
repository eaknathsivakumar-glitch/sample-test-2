const { asc, eq } = require('drizzle-orm');
const { todos } = require('../db/todos.schema');

function createTodosService(db) {
  return {
    async list({ limit, offset, completed }) {
      let query = db.select().from(todos);

      if (completed !== undefined) {
        query = query.where(eq(todos.completed, completed));
      }

      return query
        .orderBy(asc(todos.createdAt), asc(todos.id))
        .limit(limit)
        .offset(offset);
    },

    async getById(id) {
      const [todo] = await db
        .select()
        .from(todos)
        .where(eq(todos.id, id))
        .limit(1);

      return todo || null;
    },

    async create({ title }) {
      const now = new Date().toISOString();
      const [todo] = await db
        .insert(todos)
        .values({ title, createdAt: now, updatedAt: now })
        .returning();

      return todo;
    },

    async update(id, changes) {
      const [todo] = await db
        .update(todos)
        .set({ ...changes, updatedAt: new Date().toISOString() })
        .where(eq(todos.id, id))
        .returning();

      return todo || null;
    },

    async delete(id) {
      const deleted = await db
        .delete(todos)
        .where(eq(todos.id, id))
        .returning({ id: todos.id });

      return deleted.length > 0;
    }
  };
}

module.exports = { createTodosService };
