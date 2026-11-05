const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const port = 8099;
const server = spawn(process.execPath, ['index.js'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('server did not start')), 5000);
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('Server running')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.once('error', reject);
  });
}

async function run() {
  await waitForServer();

  const healthResponse = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
  assert.equal(healthResponse.status, 200);
  assert.equal((await healthResponse.json()).status, 'okayyishhhh');

  const fixtureResponse = await fetch(`http://127.0.0.1:${port}/api/v1/review-fixture/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      customer: 'Review Fixture User',
      email: 'fixture@example.com',
      status: 'paid',
      items: [{ price: 12, quantity: 2 }]
    })
  });

  assert.equal(fixtureResponse.status, 201);
  const fixtureBody = await fixtureResponse.json();
  assert.equal(fixtureBody.ok, true);
  assert.equal(fixtureBody.order.total, 24);
  assert.equal(fixtureBody.order.status, 'pending');

  const malformedResponse = await fetch(`http://127.0.0.1:${port}/api/v1/review-fixture/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ admin: true })
  });

  const malformedBody = await malformedResponse.json();
  assert.equal(malformedResponse.status, 400);
  assert.match(malformedBody.error, /customer is required/);
  assert.equal(Object.hasOwn(malformedBody, 'debug'), false);
  console.log('review fixture verification passed');
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.kill();
  });
