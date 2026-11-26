const express = require('express');
const createTodosController = require('../controllers/todos.controller');

function createTodoRoutes(todoService) {
  const router = express.Router();
  const controller = createTodosController(todoService);

  router.get('/todos', controller.listTodos);
  router.get('/todos/:id', controller.getTodo);
  router.post('/todos', controller.createTodo);
  router.patch('/todos/:id', controller.updateTodo);
  router.delete('/todos/:id', controller.deleteTodo);

  return router;
}

module.exports = createTodoRoutes;
