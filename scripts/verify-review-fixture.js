const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');

const port = 8099;
const server = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: '127.0.0.1',
      port,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const request = http.request(requestOptions, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ statusCode: response.statusCode, body }));
    });

    request.on('error', reject);
    if (options.body) request.write(options.body);
    request.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await request('/api/v1/health');
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error('server did not start');
}

async function main() {
  await waitForServer();

  const health = await request('/api/v1/health');
  assert.equal(health.statusCode, 200);
  assert.match(health.body, /okayyishhhh/);

  const body = JSON.stringify({ customer: 'Maya', amount: 1, message: 'fixture check' });
  const fixture = await request('/api/v1/review-fixture/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: 'Bearer review-fixture-token-do-not-use'
    },
    body
  });

  assert.equal(fixture.statusCode, 200);
  assert.match(fixture.body, /fixture check/);
  console.log('review fixture verification passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  server.kill();
});
