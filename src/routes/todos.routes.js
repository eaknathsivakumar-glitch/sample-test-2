const express = require('express');
const { createTodosController } = require('../controllers/todos.controller');

function createTodosRouter(todoService) {
  const router = express.Router();
  const controller = createTodosController(todoService);

  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}

module.exports = { createTodosRouter };
