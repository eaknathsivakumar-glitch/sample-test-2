const {
  createTodoBodySchema,
  listTodosQuerySchema,
  todoIdSchema,
  updateTodoBodySchema
} = require('../lib/todos.validation');
const { sendApiError, sendValidationError } = require('../lib/api-response');

function handleRoute(action) {
  return async (req, res, next) => {
    try {
      await action(req, res);
    } catch (error) {
      next(error);
    }
  };
}

function createTodosController(service) {
  return {
    list: handleRoute(async (req, res) => {
      const parsedQuery = listTodosQuerySchema.safeParse(req.query);
      if (!parsedQuery.success) {
        return sendValidationError(res, parsedQuery.error);
      }

      const { limit, offset, completed } = parsedQuery.data;
      const results = await service.list({ limit: limit + 1, offset, completed });

      return res.status(200).json({
        data: results.slice(0, limit),
        pagination: { limit, offset, hasMore: results.length > limit }
      });
    }),

    get: handleRoute(async (req, res) => {
      const parsedId = todoIdSchema.safeParse(req.params.id);
      if (!parsedId.success) {
        return sendValidationError(res, parsedId.error);
      }

      const todo = await service.getById(parsedId.data);
      if (!todo) {
        return sendApiError(res, 404, 'NOT_FOUND', 'Todo not found.');
      }

      return res.status(200).json({ data: todo });
    }),

    create: handleRoute(async (req, res) => {
      const parsedBody = createTodoBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return sendValidationError(res, parsedBody.error);
      }

      const todo = await service.create(parsedBody.data);
      return res.status(201).json({ data: todo });
    }),

    update: handleRoute(async (req, res) => {
      const parsedId = todoIdSchema.safeParse(req.params.id);
      if (!parsedId.success) {
        return sendValidationError(res, parsedId.error);
      }

      const parsedBody = updateTodoBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return sendValidationError(res, parsedBody.error);
      }

      const todo = await service.update(parsedId.data, parsedBody.data);
      if (!todo) {
        return sendApiError(res, 404, 'NOT_FOUND', 'Todo not found.');
      }

      return res.status(200).json({ data: todo });
    }),

    delete: handleRoute(async (req, res) => {
      const parsedId = todoIdSchema.safeParse(req.params.id);
      if (!parsedId.success) {
        return sendValidationError(res, parsedId.error);
      }

      const deleted = await service.delete(parsedId.data);
      if (!deleted) {
        return sendApiError(res, 404, 'NOT_FOUND', 'Todo not found.');
      }

      return res.status(204).end();
    })
  };
}

module.exports = { createTodosController };
