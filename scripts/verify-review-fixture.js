const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

const child = spawn(process.execPath, ['index.js'], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: '8091' },
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const request = http.request(
      {
        method,
        host: '127.0.0.1',
        port: 8091,
        path,
        headers: body
          ? {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(payload)
            }
          : {}
      },
      (response) => {
        let text = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          text += chunk;
        });
        response.on('end', () => {
          resolve({ statusCode: response.statusCode, body: text });
        });
      }
    );

    request.on('error', reject);
    request.end(payload);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await request('GET', '/api/v1/health');
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error('server did not start');
}

async function main() {
  try {
    await waitForServer();

    const health = await request('GET', '/api/v1/health');
    assert.equal(health.statusCode, 200);
    assert.equal(JSON.parse(health.body).status, 'okayyishhhh');

    const fixture = await request('POST', '/api/v1/review-fixture/orders', {
      customerEmail: 'review@example.com',
      price: 12.5,
      notes: 'evaluation fixture'
    });
    assert.equal(fixture.statusCode, 200);
    assert.equal(JSON.parse(fixture.body).success, true);

    console.log('review fixture verification passed');
  } finally {
    child.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
