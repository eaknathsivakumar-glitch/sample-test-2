const app = require('./app');
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`API listening on ${host}:${port}`);
});
