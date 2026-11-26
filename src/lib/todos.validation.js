const { z } = require('zod');

const titleSchema = z.string().trim().min(1, 'Title is required.').max(200);
const positiveIntegerSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'ID must be a positive integer.')
  .transform(Number)
  .pipe(z.number().int().max(Number.MAX_SAFE_INTEGER));
const pageNumberSchema = (minimum, maximum) => z
  .string()
  .regex(/^\d+$/, 'Must be a whole number.')
  .transform(Number)
  .pipe(z.number().int().min(minimum).max(maximum));

const todoIdSchema = positiveIntegerSchema;
const listTodosQuerySchema = z.object({
  limit: pageNumberSchema(1, 100).optional().default(20),
  offset: pageNumberSchema(0, 1000000).optional().default(0),
  completed: z.enum(['true', 'false']).optional().transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value === 'true';
  })
}).strict();
const createTodoBodySchema = z.object({ title: titleSchema }).strict();
const updateTodoBodySchema = z.object({
  title: titleSchema.optional(),
  completed: z.boolean().optional()
}).strict().refine((changes) => Object.keys(changes).length > 0, {
  message: 'Provide a title or completed value to update.'
});

module.exports = {
  createTodoBodySchema,
  listTodosQuerySchema,
  todoIdSchema,
  updateTodoBodySchema
};
