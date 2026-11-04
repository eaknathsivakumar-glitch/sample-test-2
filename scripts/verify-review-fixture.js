const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');

const port = 8091;
const server = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const onData = (chunk) => {
      if (chunk.toString().includes('Server running')) {
        server.stdout.off('data', onData);
        resolve();
      }
    };

    server.stdout.on('data', onData);
    server.once('error', reject);
    server.once('exit', (code) => {
      reject(new Error(`server exited before readiness with code ${code}`));
    });
  });
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: payload
          ? {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(payload)
            }
          : {}
      },
      (res) => {
        let response = '';
        res.on('data', (chunk) => {
          response += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(response) }));
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  await waitForServer();

  const health = await request('GET', '/api/v1/health');
  assert.equal(health.statusCode, 200);
  assert.equal(health.body.status, 'okayyishhhh');

  const created = await request('POST', '/api/v1/review-fixture/orders', {
    apiKey: 'review-fixture-demo-key-123',
    customerEmail: 'riley.patel@example.com',
    amount: '42.50',
    status: 'pending',
    notes: 'evaluation fixture'
  });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.ok, true);

  const listed = await request('GET', '/api/v1/review-fixture/orders?status=pending');
  assert.equal(listed.statusCode, 200);
  assert.ok(listed.body.orders.some((order) => order.customerEmail === 'riley.patel@example.com'));

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
