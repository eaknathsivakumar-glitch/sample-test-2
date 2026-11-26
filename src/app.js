const express = require('express');
const healthRoutes = require('./routes/health.routes');
const createTodoService = require('./lib/todos');
const createTodoRoutes = require('./routes/todos.routes');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use('/api/v1', healthRoutes);
  app.use('/api/v1', createTodoRoutes(createTodoService()));

  app.use('/api/v1', (req, res) => {
    res.status(404).json({
      error: { code: 'not_found', message: 'API route not found' }
    });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: { code: 'invalid_json', message: 'Request body must be valid JSON' }
      });
    }

    if (error.type === 'entity.too.large') {
      return res.status(413).json({
        error: { code: 'payload_too_large', message: 'Request body is too large' }
      });
    }

    console.error('Unhandled API error:', error);
    return res.status(500).json({
      error: { code: 'internal_error', message: 'An unexpected error occurred' }
    });
  });

  return app;
}

module.exports = createApp;
