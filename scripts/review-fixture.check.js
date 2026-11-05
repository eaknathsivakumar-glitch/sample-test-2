const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/index');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const requestOptions = {
      hostname: '127.0.0.1',
      port: 0,
      method,
      path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const server = app.listen(0, () => {
      requestOptions.port = server.address().port;
      const client = http.request(requestOptions, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          server.close();
          resolve({ status: response.statusCode, body: data });
        });
      });
      client.on('error', (error) => {
        server.close();
        reject(error);
      });
      if (payload) client.write(payload);
      client.end();
    });
  });
}

(async () => {
  const health = await request('GET', '/api/v1/health');
  assert.equal(health.status, 200);
  assert.match(health.body, /okayyishhhh/);

  const created = await request('POST', '/api/v1/review-fixture/orders', {
    customer: 'Review Fixture User',
    email: 'fixture@example.com',
    total: '29.95'
  });
  assert.equal(created.status, 200);
  assert.match(created.body, /Review Fixture User/);

  const listed = await request('GET', '/api/v1/review-fixture/orders?search=fixture');
  assert.equal(listed.status, 200);
  assert.match(listed.body, /fixture@example.com/);

  console.log('review fixture checks passed');
  process.exitCode = 0;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
