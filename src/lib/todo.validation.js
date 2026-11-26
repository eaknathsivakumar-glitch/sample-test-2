const { z } = require('zod');

const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  completed: z.boolean().optional()
}).strict();

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional()
}).strict().refine((updates) => Object.keys(updates).length > 0);

const listTodosQuerySchema = z.object({
  completed: z.enum(['true', 'false'])
    .optional()
    .transform((value) => value === undefined ? undefined : value === 'true'),
  limit: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default(20),
  offset: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(0).max(1000000))
    .default(0)
}).strict();

module.exports = {
  createTodoSchema,
  listTodosQuerySchema,
  updateTodoSchema
};
