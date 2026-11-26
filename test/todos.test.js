const assert = require('node:assert/strict');
const { after, before, it } = require('node:test');
const createApp = require('../src/app');

let server;
let apiUrl;

async function startServer() {
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  apiUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
}

async function stopServer() {
  if (!server) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
  server = undefined;
}

before(startServer);
after(stopServer);

async function request(route, options = {}) {
  return fetch(`${apiUrl}${route}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...options.headers
    }
  });
}

it('returns mock todos and supports detail, update, and delete operations', async () => {
  const initialListResponse = await request('/todos');
  assert.equal(initialListResponse.status, 200);
  const initialList = await initialListResponse.json();
  assert.equal(initialList.data.length, 3);
  assert.equal(initialList.data[0].title, 'Prepare sample API requests');

  const createResponse = await request('/todos', {
    method: 'POST',
    body: JSON.stringify({ title: '  Write API tests  ' })
  });

  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).data;
  assert.equal(created.title, 'Write API tests');
  assert.equal(created.completed, false);
  assert.ok(created.id > 3);

  const detailResponse = await request(`/todos/${created.id}`);
  assert.equal(detailResponse.status, 200);
  assert.equal((await detailResponse.json()).data.id, created.id);

  const updateResponse = await request(`/todos/${created.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).data.completed, true);

  const deleteResponse = await request(`/todos/${created.id}`, {
    method: 'DELETE'
  });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await request(`/todos/${created.id}`);
  assert.equal(missingResponse.status, 404);
  assert.equal((await missingResponse.json()).error.code, 'not_found');
});

it('resets mock mutations when a fresh app instance starts', async () => {
  const createResponse = await request('/todos', {
    method: 'POST',
    body: JSON.stringify({ title: 'Temporary demo item' })
  });
  const created = (await createResponse.json()).data;

  await stopServer();
  await startServer();

  const resetResponse = await request(`/todos/${created.id}`);
  assert.equal(resetResponse.status, 404);
});

it('validates request bodies, query parameters, and todo IDs', async () => {
  const emptyTitleResponse = await request('/todos', {
    method: 'POST',
    body: JSON.stringify({ title: '   ' })
  });
  assert.equal(emptyTitleResponse.status, 400);
  assert.equal((await emptyTitleResponse.json()).error.code, 'validation_error');

  const emptyUpdateResponse = await request('/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({})
  });
  assert.equal(emptyUpdateResponse.status, 400);

  const invalidFilterResponse = await request('/todos?completed=yes');
  assert.equal(invalidFilterResponse.status, 400);

  const invalidIdResponse = await request('/todos/not-a-number');
  assert.equal(invalidIdResponse.status, 400);

  const unknownFieldResponse = await request('/todos', {
    method: 'POST',
    body: JSON.stringify({ title: 'Read docs', unexpected: true })
  });
  assert.equal(unknownFieldResponse.status, 400);
});

it('filters completed todos and enforces bounded pagination', async () => {
  const filteredResponse = await request('/todos?completed=true&limit=1');
  assert.equal(filteredResponse.status, 200);
  const filtered = await filteredResponse.json();
  assert.equal(filtered.data.length, 1);
  assert.equal(filtered.data[0].completed, true);
  assert.deepEqual(filtered.pagination, { limit: 1, offset: 0 });

  const outOfRangeLimit = await request('/todos?limit=101');
  assert.equal(outOfRangeLimit.status, 400);
});
