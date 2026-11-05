const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const port = 8091;
const server = spawn(process.execPath, ['index.js'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    let stderr = '';
    const timeout = setTimeout(() => reject(new Error('server did not start')), 5000);

    server.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('Server running')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.once('error', reject);
    server.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`server exited with code ${code}: ${stderr}`));
    });
  });
}

async function request(path, options) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
  return { status: response.status, body: await response.json() };
}

async function main() {
  try {
    await waitForServer();

    const health = await request('/api/v1/health');
    assert.equal(health.status, 200);
    assert.equal(health.body.status, 'okayyishhhh');

    const created = await request('/api/v1/review-fixture/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: 'review-user',
        customerName: 'Review Fixture User',
        items: [{ sku: 'sample', price: 3, quantity: 2 }]
      })
    });
    assert.equal(created.status, 200);
    assert.equal(created.body.ok, true);
    assert.equal(created.body.order.total, 6);

    const list = await request('/api/v1/review-fixture/orders?userId=review-user');
    assert.equal(list.status, 200);
    assert.equal(list.body.total, 1);

    console.log('Review fixture verification passed');
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
