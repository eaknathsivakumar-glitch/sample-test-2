const express = require('express');
const healthRoutes = require('./routes/health.routes');
const { createTodosRouter } = require('./routes/todos.routes');
const { sendApiError } = require('./lib/api-response');

function createApp({ todoService }) {
  const app = express();

  app.use(express.json({ limit: '16kb' }));
  app.use('/api/v1', healthRoutes);
  app.use('/api/v1/todos', createTodosRouter(todoService));

  app.use((req, res) => {
    sendApiError(res, 404, 'NOT_FOUND', 'Route not found.');
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error.type === 'entity.parse.failed') {
      return sendApiError(res, 400, 'INVALID_JSON', 'Request body must be valid JSON.');
    }

    if (error.type === 'entity.too.large') {
      return sendApiError(res, 413, 'REQUEST_TOO_LARGE', 'Request body exceeds the 16kb limit.');
    }

    console.error(error);
    return sendApiError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  });

  return app;
}

module.exports = { createApp };
