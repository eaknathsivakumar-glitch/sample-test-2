const { createApp } = require('./app');
const { getDatabase } = require('./db/database');
const { createTodosService } = require('./services/todos.service');

function startServer() {
  const { db } = getDatabase();
  const app = createApp({ todoService: createTodosService(db) });
  const port = Number(process.env.PORT) || 8080;
  const host = process.env.HOST || '0.0.0.0';

  return app.listen(port, host, () => {
    console.log(`Server listening on ${host}:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
