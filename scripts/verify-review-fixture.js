const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const port = 8091;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [path.join(__dirname, '..', 'index.js')], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(method, requestPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const request = http.request(`${baseUrl}${requestPath}`, {
      method,
      headers: {
        ...(payload ? { 'content-type': 'application/json' } : {}),
        ...headers
      }
    }, (response) => {
      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          body: JSON.parse(responseBody)
        });
      });
    });

    request.on('error', reject);
    if (payload) {
      request.write(payload);
    }
    request.end();
  });
}

async function main() {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 2000);
    server.once('error', reject);
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('Server running')) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  const health = await request('GET', '/api/v1/health');
  assert.equal(health.statusCode, 200);
  assert.equal(health.body.status, 'okayyishhhh');

  const fixture = await request(
    'POST',
    '/api/v1/review-fixture/orders',
    {
      customer: 'Review Fixture User',
      items: [{ name: 'Test Pen', quantity: 2, price: 3.5 }]
    },
    { authorization: 'review-fixture-placeholder-token' }
  );
  assert.equal(fixture.statusCode, 201);
  assert.equal(fixture.body.ok, true);
  assert.equal(fixture.body.order.total, 7);

  console.log('review fixture verification passed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.kill();
  });
