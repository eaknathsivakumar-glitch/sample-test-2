const createApp = require('./app');
const app = createApp();

const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`API listening on ${host}:${port}`);
});

module.exports = server;
