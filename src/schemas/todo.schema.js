const { z } = require('zod');

const titleSchema = z.string().trim().min(1).max(200);

const createTodoSchema = z.object({
  title: titleSchema
}).strict();

const updateTodoSchema = z.object({
  title: titleSchema.optional(),
  completed: z.boolean().optional()
}).strict().refine(
  (changes) => changes.title !== undefined || changes.completed !== undefined,
  { message: 'Provide a title or completed status to update' }
);

const listTodosQuerySchema = z.object({
  completed: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(1000000).default(0)
}).strict();

const todoIdSchema = z.coerce.number()
  .int()
  .positive()
  .max(Number.MAX_SAFE_INTEGER);

module.exports = {
  createTodoSchema,
  listTodosQuerySchema,
  todoIdSchema,
  updateTodoSchema
};
