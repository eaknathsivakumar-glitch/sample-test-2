const { randomUUID } = require('node:crypto');
const todoRepository = require('../lib/todo.repository');
const {
  createTodoSchema,
  listTodosQuerySchema,
  updateTodoSchema
} = require('../lib/todo.validation');

function sendValidationError(res, validationError) {
  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
      details: validationError.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    }
  });
}

function listTodos(req, res) {
  const parsedQuery = listTodosQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return sendValidationError(res, parsedQuery.error);
  }

  const result = todoRepository.listTodos(parsedQuery.data);
  return res.status(200).json({
    data: result.data,
    pagination: {
      limit: parsedQuery.data.limit,
      offset: parsedQuery.data.offset,
      hasMore: result.hasMore
    }
  });
}

function createTodo(req, res) {
  const parsedBody = createTodoSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return sendValidationError(res, parsedBody.error);
  }

  const timestamp = new Date().toISOString();
  const todo = todoRepository.createTodo({
    id: randomUUID(),
    title: parsedBody.data.title,
    completed: parsedBody.data.completed ?? false,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  return res
    .status(201)
    .location(`/api/v1/todos/${todo.id}`)
    .json({ data: todo });
}

function getTodo(req, res) {
  const todo = todoRepository.getTodoById(req.params.id);

  if (!todo) {
    return sendNotFound(res);
  }

  return res.status(200).json({ data: todo });
}

function updateTodo(req, res) {
  const parsedBody = updateTodoSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return sendValidationError(res, parsedBody.error);
  }

  const todo = todoRepository.updateTodoById(req.params.id, {
    ...parsedBody.data,
    updatedAt: new Date().toISOString()
  });

  if (!todo) {
    return sendNotFound(res);
  }

  return res.status(200).json({ data: todo });
}

function deleteTodo(req, res) {
  const wasDeleted = todoRepository.deleteTodoById(req.params.id);

  if (!wasDeleted) {
    return sendNotFound(res);
  }

  return res.status(200).json({ data: { id: req.params.id, deleted: true } });
}

function sendNotFound(res) {
  return res.status(404).json({
    error: {
      code: 'TODO_NOT_FOUND',
      message: 'Todo not found.'
    }
  });
}

module.exports = {
  createTodo,
  deleteTodo,
  getTodo,
  listTodos,
  updateTodo
};
