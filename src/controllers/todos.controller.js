const {
  createTodoSchema,
  listTodosQuerySchema,
  todoIdSchema,
  updateTodoSchema
} = require('../schemas/todo.schema');

function sendValidationError(res, result) {
  return res.status(400).json({
    error: {
      code: 'validation_error',
      message: 'Request validation failed',
      details: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    }
  });
}

function sendNotFound(res) {
  return res.status(404).json({
    error: { code: 'not_found', message: 'Todo not found' }
  });
}

function createTodosController(todoService) {
  async function listTodos(req, res) {
    const result = listTodosQuerySchema.safeParse(req.query);
    if (!result.success) {
      return sendValidationError(res, result);
    }

    const { completed: completedFilter, limit, offset } = result.data;
    const completed = completedFilter === undefined
      ? undefined
      : completedFilter === 'true';
    const data = await todoService.listTodos({ completed, limit, offset });

    return res.status(200).json({ data, pagination: { limit, offset } });
  }

  async function getTodo(req, res) {
    const idResult = todoIdSchema.safeParse(req.params.id);
    if (!idResult.success) {
      return sendValidationError(res, idResult);
    }

    const data = await todoService.getTodo(idResult.data);
    if (!data) {
      return sendNotFound(res);
    }

    return res.status(200).json({ data });
  }

  async function createTodo(req, res) {
    const result = createTodoSchema.safeParse(req.body);
    if (!result.success) {
      return sendValidationError(res, result);
    }

    const data = await todoService.createTodo(result.data);
    return res
      .status(201)
      .location(`/api/v1/todos/${data.id}`)
      .json({ data });
  }

  async function updateTodo(req, res) {
    const idResult = todoIdSchema.safeParse(req.params.id);
    if (!idResult.success) {
      return sendValidationError(res, idResult);
    }

    const bodyResult = updateTodoSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return sendValidationError(res, bodyResult);
    }

    const data = await todoService.updateTodo(idResult.data, bodyResult.data);
    if (!data) {
      return sendNotFound(res);
    }

    return res.status(200).json({ data });
  }

  async function deleteTodo(req, res) {
    const idResult = todoIdSchema.safeParse(req.params.id);
    if (!idResult.success) {
      return sendValidationError(res, idResult);
    }

    const deleted = await todoService.deleteTodo(idResult.data);
    if (!deleted) {
      return sendNotFound(res);
    }

    return res.status(204).end();
  }

  return { createTodo, deleteTodo, getTodo, listTodos, updateTodo };
}

module.exports = createTodosController;
