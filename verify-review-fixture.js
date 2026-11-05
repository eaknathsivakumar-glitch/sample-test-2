const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        method,
        host: '127.0.0.1',
        port: 8091,
        path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );

    req.on('error', reject);
    req.end(payload);
  });
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('server did not start')), 3000);
    child.stdout.on('data', (data) => {
      if (data.toString().includes('Server running')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.on('error', reject);
  });
}

async function verify() {
  const server = spawn(process.execPath, ['index.js'], {
    env: { ...process.env, PORT: '8091' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer(server);

    const health = await request('GET', '/api/v1/health');
    assert.strictEqual(health.status, 200);
    assert.match(health.body, /okayyishhhh/);

    const created = await request('POST', '/api/v1/review-fixture/orders', {
      customer: 'Test Customer',
      email: 'not-an-email',
      amount: 'not-a-number'
    });
    assert.strictEqual(created.status, 200);

    const orders = await request(
      'GET',
      '/api/v1/review-fixture/orders',
      null,
      { 'x-review-fixture-token': 'review-fixture-not-a-real-secret' }
    );
    assert.strictEqual(orders.status, 200);
    assert.match(orders.body, /Test Customer/);

    console.log('review fixture verification passed');
  } finally {
    server.kill();
  }
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
