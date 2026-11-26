const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');
const { once } = require('node:events');

const temporaryDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), 'todo-api-test-')
);
process.env.DATABASE_PATH = path.join(temporaryDirectory, 'todos.sqlite');

const app = require('../src/app');
const { closeDatabase } = require('../src/db/client');

let server;
let baseUrl;
let persistedTodo;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}/api/v1/todos`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }

  closeDatabase();
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

async function request(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers
    }
  });

  return {
    body: await response.json(),
    status: response.status
  };
}

test('creates todos and persists them across database connections', async () => {
  const invalid = await request('', {
    method: 'POST',
    body: JSON.stringify({ title: '   ' })
  });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.body.error.code, 'VALIDATION_ERROR');

  const created = await request('', {
    method: 'POST',
    body: JSON.stringify({ title: 'Prepare release' })
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.data.title, 'Prepare release');
  assert.equal(created.body.data.completed, false);
  persistedTodo = created.body.data;

  closeDatabase();
  const loaded = await request(`/${persistedTodo.id}`);
  assert.equal(loaded.status, 200);
  assert.deepEqual(loaded.body.data, persistedTodo);
});

test('lists, filters, updates, and deletes todos', async () => {
  const secondTodo = await request('', {
    method: 'POST',
    body: JSON.stringify({ title: 'Review pull request' })
  });
  assert.equal(secondTodo.status, 201);

  const page = await request('?completed=false&limit=1&offset=0');
  assert.equal(page.status, 200);
  assert.equal(page.body.data.length, 1);
  assert.equal(page.body.pagination.limit, 1);
  assert.equal(page.body.pagination.hasMore, true);

  const updated = await request(`/${persistedTodo.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: true, title: 'Release shipped' })
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.completed, true);
  assert.equal(updated.body.data.title, 'Release shipped');

  const completed = await request('?completed=true');
  assert.equal(completed.status, 200);
  assert.ok(completed.body.data.some((todo) => todo.id === persistedTodo.id));

  const deleted = await request(`/${secondTodo.body.data.id}`, {
    method: 'DELETE'
  });
  assert.equal(deleted.status, 200);
  assert.equal(deleted.body.data.deleted, true);
});

test('rejects invalid list parameters and unknown todo IDs', async () => {
  const invalidLimit = await request('?limit=101');
  assert.equal(invalidLimit.status, 400);
  assert.equal(invalidLimit.body.error.code, 'VALIDATION_ERROR');

  const invalidFilter = await request('?completed=yes');
  assert.equal(invalidFilter.status, 400);

  const malformedJson = await request('', {
    method: 'POST',
    body: '{'
  });
  assert.equal(malformedJson.status, 400);
  assert.equal(malformedJson.body.error.code, 'INVALID_JSON');

  const missing = await request('/does-not-exist');
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error.code, 'TODO_NOT_FOUND');

  const invalidUpdate = await request('/does-not-exist', {
    method: 'PATCH',
    body: JSON.stringify({})
  });
  assert.equal(invalidUpdate.status, 400);

  const missingUpdate = await request('/does-not-exist', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  });
  assert.equal(missingUpdate.status, 404);

  const missingDelete = await request('/does-not-exist', {
    method: 'DELETE'
  });
  assert.equal(missingDelete.status, 404);
});
