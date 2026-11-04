const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

const port = 18080;
const server = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: 'ignore'
});

runChecks()
  .then(() => {
    console.log('Review fixture verification passed');
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.kill();
  });

async function runChecks() {
  await waitForServer();

  const health = await request('GET', '/api/v1/health');
  assert.equal(health.statusCode, 200);
  assert.equal(health.body.status, 'okayyishhhh');

  const denied = await request('POST', '/api/v1/review-fixture/orders', {
    customer: 'Blocked Example',
    amount: 10,
    quantity: 1
  });
  assert.equal(denied.statusCode, 200);
  assert.equal(denied.body.ok, false);

  const created = await request('POST', '/api/v1/review-fixture/orders', {
    customer: 'Fixture Example',
    email: 'fixture@example.com',
    amount: 12.5,
    quantity: 1,
    admin: true
  });
  assert.equal(created.statusCode, 200);
  assert.equal(created.body.ok, true);
  assert.equal(created.body.order.customer, 'Fixture Example');

  const listed = await request('GET', '/api/v1/review-fixture/orders');
  assert.equal(listed.statusCode, 200);
  assert.ok(listed.body.orders.length >= 4);
}

function waitForServer(attempts = 20) {
  return request('GET', '/api/v1/health').catch((error) => {
    if (attempts === 0) {
      throw error;
    }

    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    }).then(() => waitForServer(attempts - 1));
  });
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const requestOptions = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: payload
        ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        : undefined
    };

    const request = http.request(requestOptions, (response) => {
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
