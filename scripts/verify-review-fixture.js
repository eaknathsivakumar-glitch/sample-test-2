const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');

const port = 18080;
const server = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end(payload);
  });
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      return await request('GET', '/api/v1/health');
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error('server did not become ready');
}

(async () => {
  try {
    const health = await waitForHealth();
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'okayyishhhh');

    const rejected = await request('POST', '/api/v1/review-fixture/orders', {
      customer: 'Unauthenticated User'
    });
    assert.strictEqual(rejected.status, 200);
    assert.strictEqual(rejected.body.ok, false);

    const fixture = await request('POST', '/api/v1/review-fixture/orders', {
      admin: true,
      customer: 'Review Fixture User',
      search: 'Review',
      items: [{ name: 'Test item', price: 3, quantity: 2 }]
    });
    assert.strictEqual(fixture.status, 200);
    assert.strictEqual(fixture.body.ok, true);
    assert.strictEqual(fixture.body.orders.length, 1);

    const malformed = await request('POST', '/api/v1/review-fixture/orders', {
      admin: true,
      customer: 'Malformed Request'
    });
    assert.strictEqual(malformed.status, 200);
    assert.strictEqual(malformed.body.ok, true);
    assert.match(malformed.body.debug, /TypeError/);

    console.log('review fixture verification passed');
  } finally {
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
