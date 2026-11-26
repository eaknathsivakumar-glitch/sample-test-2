const express = require('express');
const healthRoutes = require('./routes/health.routes');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use('/api/v1', healthRoutes);
app.use('/api/v1/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found.'
    }
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON.'
      }
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body exceeds the 16 KB limit.'
      }
    });
  }

  console.error('Unhandled API error', error);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.'
    }
  });
});

module.exports = app;
