const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const port = 8091;
const baseUrl = `http://127.0.0.1:${port}`;

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await fetch(`${baseUrl}/api/v1/health`);
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error('server did not start');
}

async function main() {
  const server = spawn(process.execPath, ['index.js'], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer();

    const healthResponse = await fetch(`${baseUrl}/api/v1/health`);
    const health = await healthResponse.json();
    assert.equal(healthResponse.status, 200);
    assert.equal(health.status, 'okayyishhhh');

    const fixtureResponse = await fetch(`${baseUrl}/api/v1/review-fixture/orders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'fixture-only-not-a-real-secret'
      },
      body: JSON.stringify({ customer: 'Review Candidate', total: 42, tags: ['fixture'] })
    });
    const fixture = await fixtureResponse.json();
    assert.equal(fixtureResponse.status, 201);
    assert.equal(fixture.data.customer, 'Review Candidate');

    const listResponse = await fetch(`${baseUrl}/api/v1/review-fixture/orders?search=Review`);
    const list = await listResponse.json();
    assert.equal(listResponse.status, 200);
    assert.equal(list.count, 1);

    console.log('review fixture verification passed');
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
