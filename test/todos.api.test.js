const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { test } = require('node:test');
const { createApp } = require('../src/app');
const { createDatabase } = require('../src/db/database');
const { createTodosService } = require('../src/services/todos.service');

test('todo API validates requests and persists CRUD changes', async (t) => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-api-'));
  const databasePath = path.join(temporaryDirectory, 'todos.sqlite');
  let database = createDatabase(databasePath);
  const server = createApp({
    todoService: createTodosService(database.db)
  }).listen(0, '127.0.0.1');

  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/todos`;

  t.after(async () => {
    if (server.listening) {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }

    if (database) {
      database.client.close();
    }

    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  const createRequest = (body) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const updateRequest = (body) => ({
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });

  const invalidCreate = await fetch(baseUrl, createRequest({ title: '  ' }));
  assert.equal(invalidCreate.status, 400);
  assert.equal((await invalidCreate.json()).error.code, 'VALIDATION_ERROR');

  const invalidQuery = await fetch(`${baseUrl}?limit=101`);
  assert.equal(invalidQuery.status, 400);

  const createResponse = await fetch(baseUrl, createRequest({ title: 'Write tests' }));
  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).data;
  assert.equal(created.title, 'Write tests');
  assert.equal(created.completed, false);

  const listResponse = await fetch(`${baseUrl}?completed=false&limit=1`);
  assert.equal(listResponse.status, 200);
  const listed = await listResponse.json();
  assert.equal(listed.data[0].id, created.id);
  assert.equal(listed.pagination.hasMore, false);

  const missingGet = await fetch(`${baseUrl}/999999`);
  assert.equal(missingGet.status, 404);
  assert.equal((await missingGet.json()).error.code, 'NOT_FOUND');

  const emptyUpdate = await fetch(`${baseUrl}/${created.id}`, updateRequest({}));
  assert.equal(emptyUpdate.status, 400);

  const missingUpdate = await fetch(`${baseUrl}/999999`, updateRequest({ completed: true }));
  assert.equal(missingUpdate.status, 404);

  const updateResponse = await fetch(
    `${baseUrl}/${created.id}`,
    updateRequest({ title: 'Write API tests', completed: true })
  );
  assert.equal(updateResponse.status, 200);
  const updated = (await updateResponse.json()).data;
  assert.equal(updated.title, 'Write API tests');
  assert.equal(updated.completed, true);
  assert.notEqual(updated.updatedAt, created.updatedAt);

  const completedList = await fetch(`${baseUrl}?completed=true`);
  assert.equal((await completedList.json()).data.length, 1);

  const secondResponse = await fetch(baseUrl, createRequest({ title: 'Review changes' }));
  assert.equal(secondResponse.status, 201);
  const second = (await secondResponse.json()).data;
  const paginatedResponse = await fetch(`${baseUrl}?limit=1`);
  const paginated = await paginatedResponse.json();
  assert.equal(paginated.data.length, 1);
  assert.equal(paginated.pagination.hasMore, true);

  const deleteResponse = await fetch(`${baseUrl}/${second.id}`, { method: 'DELETE' });
  assert.equal(deleteResponse.status, 204);

  const missingDelete = await fetch(`${baseUrl}/999999`, { method: 'DELETE' });
  assert.equal(missingDelete.status, 404);

  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
  database.client.close();
  database = null;

  database = createDatabase(databasePath);
  const persistedTodo = await createTodosService(database.db).getById(created.id);
  assert.equal(persistedTodo.title, 'Write API tests');
  assert.equal(persistedTodo.completed, true);
  database.client.close();
  database = null;
});
