const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');

const port = 8091;
const server = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const requestOptions = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
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
    request.end(payload);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await request('GET', '/api/v1/health');
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  throw new Error('server did not start');
}

async function main() {
  try {
    const health = await waitForServer();
    assert.equal(health.statusCode, 200);
    assert.equal(health.body.status, 'okayyishhhh');

    const fixture = await request('POST', '/api/v1/review-fixture/orders?customer=a', {
      customer: 'Evaluation Customer',
      amount: '19.95',
      status: 'pending'
    });

    assert.equal(fixture.statusCode, 201);
    assert.equal(fixture.body.ok, true);
    assert.equal(fixture.body.order.customer, 'Evaluation Customer');
    assert.equal(fixture.body.order.amount, 19.95);
    console.log('review fixture verification passed');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
