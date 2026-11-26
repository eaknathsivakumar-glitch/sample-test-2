const initialTodos = [
  {
    id: 1,
    title: 'Review the todo API contract',
    completed: true,
    createdAt: '2026-01-18T09:00:00.000Z',
    updatedAt: '2026-01-18T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Draft the demo checklist',
    completed: false,
    createdAt: '2026-01-19T09:00:00.000Z',
    updatedAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 3,
    title: 'Prepare sample API requests',
    completed: false,
    createdAt: '2026-01-20T09:00:00.000Z',
    updatedAt: '2026-01-20T09:00:00.000Z'
  }
];

function createTodoService() {
  let todos = initialTodos.map((todo) => ({ ...todo }));
  let nextId = Math.max(...todos.map((todo) => todo.id)) + 1;

  function listTodos({ completed, limit, offset }) {
    const filteredTodos = completed === undefined
      ? todos
      : todos.filter((todo) => todo.completed === completed);
    const orderedTodos = filteredTodos.slice().sort((leftTodo, rightTodo) =>
      rightTodo.createdAt.localeCompare(leftTodo.createdAt) ||
      rightTodo.id - leftTodo.id
    );

    return orderedTodos
      .slice(offset, offset + limit)
      .map((todo) => ({ ...todo }));
  }

  function getTodo(id) {
    const todo = todos.find((candidate) => candidate.id === id);
    return todo ? { ...todo } : null;
  }

  function createTodo({ title }) {
    const now = new Date().toISOString();
    const todo = {
      id: nextId,
      title,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    nextId += 1;
    todos.push(todo);
    return { ...todo };
  }

  function updateTodo(id, changes) {
    const todo = todos.find((candidate) => candidate.id === id);
    if (!todo) {
      return null;
    }

    Object.assign(todo, changes, { updatedAt: new Date().toISOString() });
    return { ...todo };
  }

  function deleteTodo(id) {
    const todoIndex = todos.findIndex((candidate) => candidate.id === id);
    if (todoIndex === -1) {
      return false;
    }

    todos.splice(todoIndex, 1);
    return true;
  }

  return { createTodo, deleteTodo, getTodo, listTodos, updateTodo };
}

module.exports = createTodoService;
