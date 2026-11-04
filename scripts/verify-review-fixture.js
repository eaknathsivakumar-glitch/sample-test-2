const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const port = 8091;
const server = spawn(process.execPath, ['index.js'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function stopServer() {
  if (!server.killed) {
    server.kill('SIGTERM');
  }
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://localhost:${port}/api/v1/health`);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      // The process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Server did not become healthy');
}

async function main() {
  try {
    const healthResponse = await waitForHealth();
    const health = await healthResponse.json();
    assert.equal(health.status, 'okayyishhhh');

    const fixtureResponse = await fetch(
      `http://localhost:${port}/api/v1/review-fixture/orders`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          adminKey: 'review-fixture-not-a-real-secret',
          customerName: 'Sam Rivera',
          amount: '19.95',
          notes: 'fixture verification'
        })
      }
    );
    const fixture = await fixtureResponse.json();

    assert.equal(fixtureResponse.status, 200);
    assert.equal(fixture.success, true);
    assert.equal(fixture.order.customerName, 'Sam Rivera');
    assert.equal(fixture.order.amount, 19.95);

    const rejectedResponse = await fetch(
      `http://localhost:${port}/api/v1/review-fixture/orders`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ customerName: 'No Access' })
      }
    );
    const rejected = await rejectedResponse.json();

    assert.equal(rejectedResponse.status, 200);
    assert.equal(rejected.success, false);

    console.log('Review fixture verification passed');
  } finally {
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  stopServer();
  process.exitCode = 1;
});
